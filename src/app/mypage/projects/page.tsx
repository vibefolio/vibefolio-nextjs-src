// src/app/mypage/projects/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/ImageCard";
import dayjs from "dayjs";

interface Project {
  id: string;
  title?: string;
  urls: {
    full: string;
    regular: string;
  };
  user: {
    username: string;
    profile_image: {
      small: string;
      large: string;
    };
  };
  likes: number;
  views?: number;
  description: string | null;
  alt_description: string | null;
  created_at: string;
  width: number;
  height: number;
  category: string;
  tags?: string[];
}

export default function MyProjectsPage() {
  const router = useRouter();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    // 내 프로젝트 로드
    const loadMyProjects = () => {
      try {
        const savedProjects = localStorage.getItem("projects");
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          setMyProjects(projects);
          setTotalProjects(projects.length);
        }
      } catch (error) {
        console.error("프로젝트 로딩 실패:", error);
      }
    };

    loadMyProjects();

    // 프로젝트 변경 감지
    const interval = setInterval(loadMyProjects, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (projectId: string) => {
    if (!confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const savedProjects = localStorage.getItem("projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const filteredProjects = projects.filter((p: Project) => p.id !== projectId);
        localStorage.setItem("projects", JSON.stringify(filteredProjects));
        setMyProjects(filteredProjects);
        setTotalProjects(filteredProjects.length);
        alert("프로젝트가 삭제되었습니다.");
      }
    } catch (error) {
      console.error("프로젝트 삭제 실패:", error);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary mb-4"
          >
            <ArrowLeft size={20} />
            뒤로 가기
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Upload size={32} className="text-green-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  내 프로젝트
                </h1>
              </div>
              <p className="text-secondary text-lg">
                총 {totalProjects}개의 프로젝트를 업로드했습니다
              </p>
            </div>
            <Button
              onClick={() => router.push("/project/upload")}
              className="btn-primary"
            >
              <Upload size={20} className="mr-2" />
              새 프로젝트
            </Button>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {myProjects.length > 0 ? (
          <div className="space-y-6">
            {myProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-subtle hover:shadow-card transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* 프로젝트 썸네일 */}
                  <div
                    className="w-full md:w-64 h-48 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    <img
                      src={project.urls.regular}
                      alt={project.title || "프로젝트"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* 프로젝트 정보 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3
                          className="text-2xl font-bold text-primary mb-2 cursor-pointer hover:text-purple-600"
                          onClick={() => router.push(`/project/${project.id}`)}
                        >
                          {project.title || "제목 없음"}
                        </h3>
                        <p className="text-secondary line-clamp-2">
                          {project.description || project.alt_description || "설명이 없습니다."}
                        </p>
                      </div>
                    </div>

                    {/* 통계 */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2 text-secondary">
                        <Eye size={16} />
                        <span className="text-sm">조회 {project.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="text-sm">
                          좋아요 {project.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="text-sm">
                          {dayjs(project.created_at).format("YYYY.MM.DD")}
                        </span>
                      </div>
                    </div>

                    {/* 태그 */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/project/${project.id}`)}
                        className="btn-secondary"
                      >
                        <Eye size={16} className="mr-2" />
                        보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/project/edit/${project.id}`)}
                        className="btn-secondary"
                      >
                        <Edit size={16} className="mr-2" />
                        편집
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Upload size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              업로드한 프로젝트가 없습니다
            </h2>
            <p className="text-secondary mb-8">
              첫 번째 프로젝트를 업로드해보세요
            </p>
            <Button
              onClick={() => router.push("/project/upload")}
              className="btn-primary"
            >
              <Upload size={20} className="mr-2" />
              프로젝트 업로드
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
