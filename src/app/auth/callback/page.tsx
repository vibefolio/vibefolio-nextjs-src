"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/**
 * [Pure Callback Page]
 * 아무런 커스텀 로직 없이, 오직 Supabase가 인증을 완료하면 홈으로 보내주는 역할만 합니다.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase가 URL의 해시나 쿼리를 읽어서 세션을 잡도록 시간을 줍니다.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("[Callback] Login confirmed by Supabase Engine");
        router.replace("/");
      }
    });

    // 만약 이미 세션이 있다면 바로 이동
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/");
      }
    });

    // 10초 뒤에도 아무 반응이 없으면 로그인 페이지로 돌려보냄 (안전장치)
    const fallback = setTimeout(() => {
      router.push("/login");
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-400">로그인 중입니다...</p>
      </div>
    </div>
  );
}
