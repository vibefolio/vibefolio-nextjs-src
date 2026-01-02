"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      console.log("[Callback] Starting manual code exchange...");
      
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorMsg = url.searchParams.get("error_description") || url.searchParams.get("error");

      if (errorMsg) {
        console.error("[Callback] Error from URL:", errorMsg);
        setError(errorMsg);
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      if (!code) {
        console.warn("[Callback] No code found, checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace("/");
        } else {
          setError("인증 코드를 찾을 수 없습니다.");
          setTimeout(() => router.push("/login"), 2000);
        }
        return;
      }

      try {
        // PKCE 코드 교환
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) throw exchangeError;
        
        if (data.session) {
          console.log("[Callback] Exchange success, setting flags...");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("lastActivity", Date.now().toString());
          
          // 전역 세션 상태 동기화를 위해 짧은 대기 후 이동 (선택적)
          router.replace("/");
        } else {
          throw new Error("세션을 성공적으로 가져오지 못했습니다.");
        }
      } catch (e: any) {
        console.error("[Callback] Fatal Error:", e.message);
        setError(e.message || "인증 처리 중 서버 오류가 발생했습니다.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black font-sans">
      <div className="text-center p-8 max-w-sm w-full border border-gray-100 rounded-3xl shadow-2xl">
        {!error ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h1 className="text-xl font-bold mb-2">인증 완료 중</h1>
              <p className="text-gray-500 text-sm">안전하게 로그인 처리를 진행하고 있습니다.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 bg-red-100 text-red-500 flex items-center justify-center rounded-full text-2xl font-bold">!</div>
            <div>
              <h1 className="text-xl font-bold mb-2 text-red-600">인증 실패</h1>
              <p className="text-gray-500 text-sm">{error}</p>
              <p className="text-xs text-gray-400 mt-4">잠시 후 로그인 페이지로 돌아갑니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
