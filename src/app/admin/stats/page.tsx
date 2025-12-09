// src/app/admin/stats/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Eye, Heart, Users } from "lucide-react";
import Link from "next/link";

export default function AdminStatsPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLikes: 0,
    totalViews: 0,
    totalInquiries: 0,
  });

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");

    const totalLikes = projects.reduce((sum: number, p: any) => sum + (p.likes || 0), 0);
    const totalViews = projects.reduce((sum: number, p: any) => sum + (p.views || 0), 0);

    setStats({
      totalProjects: projects.length,
      totalLikes,
      totalViews,
      totalInquiries: inquiries.length,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={20} className="mr-2" />
          관리자 대시보드로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          통계
        </h1>
        <p className="text-gray-600 mb-8">
          사이트 전체 통계를 확인하세요
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                전체 프로젝트
              </CardTitle>
              <TrendingUp className="text-blue-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalProjects}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                등록된 프로젝트 수
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                총 좋아요
              </CardTitle>
              <Heart className="text-red-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalLikes}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                모든 프로젝트의 좋아요 합계
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                총 조회수
              </CardTitle>
              <Eye className="text-green-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalViews}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                모든 프로젝트의 조회수 합계
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                문의 수
              </CardTitle>
              <Users className="text-orange-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalInquiries}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                전체 1:1 문의 수
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>상세 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <span className="text-gray-700">프로젝트당 평균 좋아요</span>
                <span className="font-bold text-gray-900">
                  {stats.totalProjects > 0
                    ? (stats.totalLikes / stats.totalProjects).toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <span className="text-gray-700">프로젝트당 평균 조회수</span>
                <span className="font-bold text-gray-900">
                  {stats.totalProjects > 0
                    ? (stats.totalViews / stats.totalProjects).toFixed(1)
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
