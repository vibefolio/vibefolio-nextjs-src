"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const processedRef = useRef(false);

  useEffect(() => {
    // 이미 처리했으면 스킵
    if (processedRef.current) return;
    
    let isMounted = true;
    processedRef.current = true; // Mark as processing
    
    // 타임아웃 설정 - 15초로 연장
    const timeout = setTimeout(() => {
      if (isMounted && status === "loading") {
        console.error("Auth callback 타임아웃");
        setStatus("error");
        setErrorMessage("인증 처리 시간이 초과되었습니다. 다시 로그인해주세요.");
        
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          if (isMounted) {
            router.push("/login?error=auth_timeout");
          }
        }, 3000);
      }
    }, 15000);

    // onAuthStateChange로 세션 변경 감지 (가장 확실한 방법)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) return;
        
        console.log("Auth Callback - Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session) {
          console.log("Auth Callback - SIGNED_IN event received", session.user.email);
          setStatus("success");
          setTimeout(() => {
             if(isMounted) router.replace("/"); // push -> replace
          }, 500); // 0.5초 딜레이로 안정성 확보
        } else if (event === "PASSWORD_RECOVERY") {
          router.replace("/reset-password");
        }
      }
    );

    const handleAuth = async () => {
      try {
        console.log("Auth callback processing started...");

        // 1. 이미 세션이 있는지 확인 (Supabase가 URL에서 자동 감지했을 수 있음)
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          console.log("Session already exists (via auto-detect)");
          if (isMounted) {
            setStatus("success");
            router.replace("/");
          }
          return;
        }

        // URL 분석
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const code = searchParams.get("code");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const errorParam = searchParams.get("error");
        const errorDesc = searchParams.get("error_description");

        if (errorParam) {
           throw new Error(errorDesc || errorParam);
        }

        if (code) {
          console.log("PKCE Code found, exchanging...");
          // supabase-js 2.x에서는 getSession() 호출 시 URL의 코드를 자동으로 감지하고 교환함.
          // 따라서 명시적 exchangeCodeForSession 호출이 때로는 'code already used' 에러를 유발할 수 있음.
          // 하지만 getSession()으로 해결되지 않았을 경우를 대비해 명시적 호출 시도.
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            // 코드가 이미 사용됨 등의 에러일 수 있음. 세션 다시 확인
            console.warn("Manual exchange failed:", error.message);
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
               console.log("Session found after exchange error (likely race condition)");
               setStatus("success");
               router.replace("/");
               return;
            }
            throw error;
          }

          if (data.session) {
             console.log("Manual exchange success");
             setStatus("success");
             router.replace("/");
             return;
          }
        } else if (accessToken && refreshToken) {
           console.log("Implicit tokens found");
           const { data, error } = await supabase.auth.setSession({
             access_token: accessToken,
             refresh_token: refreshToken,
           });
           if (error) throw error;
           if (data.session) {
              setStatus("success");
              router.replace("/");
              return;
           }
        }
        
        // 아무것도 해당되지 않으면 잠시 대기 (onAuthStateChange가 처리할 수도 있음)
        // 2초 후에도 세션이 없으면 에러 혹은 로그인 페이지로
        
      } catch (error: any) {
        console.error("Auth process error:", error);
        // 에러가 났어도 onAuthStateChange가 성공시킬 수 있으므로 즉시 실패처리하지 않음
        // 하지만 명백한 에러라면 표시
        // setErrorMessage(error.message);
      }
    };

    handleAuth();

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        {status === "loading" && (
          <>
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#4ACAD4] rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">인증을 완료하는 중입니다...</p>
              <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">로그인 성공!</p>
              <p className="text-sm text-gray-500 mt-2">메인 페이지로 이동합니다...</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">인증 오류</p>
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
              <p className="text-sm text-gray-500 mt-2">로그인 페이지로 이동합니다...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
