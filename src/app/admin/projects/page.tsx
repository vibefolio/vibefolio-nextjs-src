// src/app/admin/projects/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      localStorage.setItem("projects", JSON.stringify(updated));
      alert("프로젝트가 삭제되었습니다.");
    }
  };

  const filteredProjects = projects.filter((project) =>
    (project.title?.toLowerCase() || project.description?.toLowerCase() || "").includes(
      searchTerm.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            관리자 대시보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            프로젝트 관리
          </h1>
          <p className="text-gray-600">
            등록된 모든 프로젝트를 조회하고 관리하세요
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="flex items-center border rounded-lg px-4 py-2 bg-white">
            <Search size={20} className="text-gray-400 mr-2" />
            <Input
              placeholder="프로젝트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">전체 프로젝트</p>
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">검색 결과</p>
              <p className="text-3xl font-bold text-gray-900">{filteredProjects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">총 좋아요</p>
              <p className="text-3xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + (p.likes || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 프로젝트 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 목록 ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                {searchTerm ? "검색 결과가 없습니다" : "등록된 프로젝트가 없습니다"}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={project.urls?.regular || "/globe.svg"}
                        alt={project.title || "프로젝트"}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {project.title || project.description?.substring(0, 50) || "제목 없음"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {project.description || project.alt_description || "설명 없음"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>작성자: {project.user?.username || "익명"}</span>
                          <span>좋아요: {project.likes || 0}</span>
                          <span>
                            등록일: {new Date(project.created_at).toLocaleDateString("ko-KR")}
                          </span>
                          {project.category && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {project.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.urls?.full, "_blank")}
                      >
                        <Eye size={16} className="mr-1" />
                        보기
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
