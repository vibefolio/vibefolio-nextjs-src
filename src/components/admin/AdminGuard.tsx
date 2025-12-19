"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdmin();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAdmin) {
        // 관리자가 아니면 메인으로 리다이렉트 (history replace 사용)
        router.replace("/");
      } else {
        setShowContent(true);
      }
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !showContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">관리자 권한 확인 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
