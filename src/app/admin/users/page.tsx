// src/app/admin/users/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={20} className="mr-2" />
          관리자 대시보드로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          사용자 관리
        </h1>
        <p className="text-gray-600 mb-8">
          회원 정보를 조회하고 관리하세요
        </p>

        <Card>
          <CardContent className="py-20 text-center">
            <Users size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500 mb-2">
              사용자 관리 기능 준비 중
            </p>
            <p className="text-sm text-gray-400">
              실제 사용자 인증 시스템 구축 후 사용 가능합니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
