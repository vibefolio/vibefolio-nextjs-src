// src/app/admin/recruit/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminRecruitPage() {
  const router = useRouter();

  useEffect(() => {
    // 연결 페이지로 리다이렉트 (이미 관리 기능이 있음)
    router.push("/recruit");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={20} className="mr-2" />
          관리자 대시보드로 돌아가기
        </Link>
        <p className="text-gray-600">채용/공모전 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
