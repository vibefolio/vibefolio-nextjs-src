"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/**
 * [Callback Page]
 * 이 페이지는 오직 한 가지만 합니다.
 * Supabase가 URL의 인증 정보를 처리하고 세션을 잡아챌 때까지 "기다리는 것" 입니다.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    console.log("[Callback] Waiting for Supabase to process auth...");

    // 15초 타임아웃 (아무 반응 없을 경우)
    const timer = setTimeout(() => {
      if (!error) {
        console.error("[Callback] Auth Timeout - Redirecting to login");
        setError("인증 시간이 초과되었습니다.");
        setTimeout(() => router.push("/login"), 2000);
      }
    }, 15000);

    // 가장 확실한 방법: 이벤트 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[Callback] Auth Event Received: ${event}`);
      
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        console.log("[Callback] Login Successful, saving flags and redirecting...");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("lastActivity", Date.now().toString());
        
        clearTimeout(timer);
        router.replace("/");
      }
    });

    // 만약 이미 세션이 잡혀있다면 (매우 빠른 경우)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("[Callback] Session already exists, redirecting...");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("lastActivity", Date.now().toString());
        clearTimeout(timer);
        router.replace("/");
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [router, error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center p-12 max-w-sm border border-gray-100 rounded-[40px] shadow-2xl">
        {!error ? (
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div className="w-16 h-16 border-[5px] border-gray-100 rounded-full"></div>
              <div className="absolute top-0 w-16 h-16 border-[5px] border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">반가워요!</h1>
              <p className="text-gray-400 text-sm font-medium">안전한 로그인을 위해 세션을 불러오는 중입니다.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full text-2xl">!</div>
            <div>
              <h1 className="text-xl font-bold text-red-600 mb-2">인증에 실패했습니다</h1>
              <p className="text-gray-500 text-sm">{error}</p>
              <button 
                onClick={() => router.push("/login")}
                className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold"
              >
                다시 로그인하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
