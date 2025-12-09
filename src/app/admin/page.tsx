// src/app/admin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  Users,
  Briefcase,
  MessageCircle,
  FileText,
  Settings,
  BarChart3,
  Shield,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    totalInquiries: 0,
    totalRecruitItems: 0,
    totalBanners: 0,
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  // 통계 및 최근 데이터 로드
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    const recruitItems = JSON.parse(localStorage.getItem("recruitItems") || "[]");
    const banners = JSON.parse(localStorage.getItem("banners") || "[]");

    setStats({
      totalProjects: projects.length,
      totalUsers: 1, // 임시
      totalInquiries: inquiries.length,
      totalRecruitItems: recruitItems.length,
      totalBanners: banners.length,
    });

    // 최근 프로젝트 (최신 5개)
    setRecentProjects(projects.slice(-5).reverse());
    // 최근 문의 (최신 5개)
    setRecentInquiries(inquiries.slice(-5).reverse());
  }, []);

  const adminMenus = [
    {
      title: "배너 관리",
      description: "메인 페이지 배너 업로드 및 관리",
      icon: ImageIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      path: "/admin/banners",
      count: stats.totalBanners,
    },
    {
      title: "프로젝트 관리",
      description: "등록된 프로젝트 조회 및 관리",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      path: "/admin/projects",
      count: stats.totalProjects,
    },
    {
      title: "채용/공모전 관리",
      description: "채용, 공모전, 이벤트 관리",
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-50",
      path: "/admin/recruit",
      count: stats.totalRecruitItems,
    },
    {
      title: "문의 관리",
      description: "1:1 문의 내역 조회 및 답변",
      icon: MessageCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      path: "/admin/inquiries",
      count: stats.totalInquiries,
    },
    {
      title: "사용자 관리",
      description: "회원 정보 조회 및 관리",
      icon: Users,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      path: "/admin/users",
      count: stats.totalUsers,
    },
    {
      title: "통계",
      description: "사이트 통계 및 분석",
      icon: BarChart3,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      path: "/admin/stats",
      count: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-[#4ACAD4]" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">
                관리자 대시보드
              </h1>
            </div>
            <p className="text-gray-600">
              사이트 전체를 관리하고 모니터링하세요
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              사이트로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">전체 프로젝트</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalProjects}
                  </p>
                </div>
                <FileText className="text-blue-500" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">문의 내역</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalInquiries}
                  </p>
                </div>
                <MessageCircle className="text-orange-500" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">채용/공모전</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalRecruitItems}
                  </p>
                </div>
                <Briefcase className="text-green-500" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">배너</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalBanners}
                  </p>
                </div>
                <ImageIcon className="text-purple-500" size={40} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 관리 메뉴 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">관리 메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminMenus.map((menu, index) => (
              <Link href={menu.path} key={index}>
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`${menu.bgColor} p-3 rounded-lg`}>
                        <menu.icon className={menu.color} size={24} />
                      </div>
                      {menu.count !== null && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                          {menu.count}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-4">{menu.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{menu.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 프로젝트 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 등록된 프로젝트</CardTitle>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  등록된 프로젝트가 없습니다
                </p>
              ) : (
                <div className="space-y-3">
                  {recentProjects.map((project, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={project.urls?.regular || "/globe.svg"}
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {project.title || project.description?.substring(0, 30) || "제목 없음"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.user?.username || "익명"}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 최근 문의 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 문의</CardTitle>
            </CardHeader>
            <CardContent>
              {recentInquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  문의 내역이 없습니다
                </p>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.map((inquiry, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">
                          {inquiry.projectTitle}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(inquiry.date).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {inquiry.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
