// src/app/mypage/bookmarks/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/ImageCard";
import { getBookmarkedProjects, getTotalBookmarksCount } from "@/lib/bookmarks";

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

export default function BookmarkedProjectsPage() {
  const router = useRouter();
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Project[]>([]);
  const [totalBookmarks, setTotalBookmarks] = useState(0);

  useEffect(() => {
    // 북마크한 프로젝트 로드
    const loadBookmarkedProjects = () => {
      const projects = getBookmarkedProjects();
      const count = getTotalBookmarksCount();
      setBookmarkedProjects(projects);
      setTotalBookmarks(count);
    };

    loadBookmarkedProjects();

    // 북마크 변경 감지
    const interval = setInterval(loadBookmarkedProjects, 1000);
    return () => clearInterval(interval);
  }, []);

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

          <div className="flex items-center gap-3 mb-2">
            <Bookmark size={32} className="text-blue-500" fill="currentColor" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              북마크한 프로젝트
            </h1>
          </div>
          <p className="text-secondary text-lg">
            총 {totalBookmarks}개의 프로젝트를 북마크했습니다
          </p>
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {bookmarkedProjects.length > 0 ? (
          <div className="masonry-grid">
            {bookmarkedProjects.map((project) => (
              <ImageCard key={project.id} props={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Bookmark size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              북마크한 프로젝트가 없습니다
            </h2>
            <p className="text-secondary mb-8">
              나중에 다시 보고 싶은 프로젝트를 북마크하세요
            </p>
            <Button onClick={() => router.push("/")} className="btn-primary">
              프로젝트 둘러보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
