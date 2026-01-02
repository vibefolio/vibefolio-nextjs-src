"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/**
 * [Fast Callback Page]
 * 세션이 잡히면 즉시 이동하고, 
 * 안 잡혀도 3초 뒤엔 무조건 메인으로 쫓아보냅니다.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. 이벤트 리스너 (정석)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log("[Callback] Event detected, redirecting...");
        router.replace("/");
      }
    });

    // 2. 0.5초마다 세션 폴링 (성격 급한 체크)
    const poller = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("[Callback] Polling detected session, redirecting...");
        router.replace("/");
      }
    }, 500);

    // 3. 3초 타임아웃 (안전장치) -> 무조건 홈으로
    const fallback = setTimeout(() => {
      console.warn("[Callback] Timeout! Forcing redirect to home...");
      router.replace("/"); 
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(poller);
      clearTimeout(fallback);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* 스피너 크기를 줄이고 메시지를 더 친절하게 변경 */}
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}
