"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // URL에 있는 code나 hash를 Supabase 클라이언트가 자동으로 감지합니다.
    // 명시적으로 세션을 확인하고 리다이렉트합니다.
    const handleAuth = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Auth callback error:", error);
            router.push("/login?error=auth_callback_failed");
        } else if (session) {
            router.push("/");
        } else {
            // 세션이 바로 안 잡힐 경우를 대비해 잠시 대기하거나 로그인 페이지로
            // PKCE 코드가 있으면 supabase-js가 처리를 시도합니다.
            // 처리가 끝나면 onAuthStateChange가 발동할 것입니다.
        }
    };

    handleAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">인증을 완료하는 중입니다...</p>
      </div>
    </div>
  );
}
