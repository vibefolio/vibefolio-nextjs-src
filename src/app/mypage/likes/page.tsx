// src/app/mypage/likes/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/ImageCard";
import { getLikedProjects, getTotalLikesCount } from "@/lib/likes";

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

export default function LikedProjectsPage() {
  const router = useRouter();
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    // 좋아요한 프로젝트 로드
    const loadLikedProjects = () => {
      const projects = getLikedProjects();
      const count = getTotalLikesCount();
      setLikedProjects(projects);
      setTotalLikes(count);
    };

    loadLikedProjects();

    // 좋아요 변경 감지
    const interval = setInterval(loadLikedProjects, 1000);
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
            <Heart size={32} className="text-red-500" fill="currentColor" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              좋아요한 프로젝트
            </h1>
          </div>
          <p className="text-secondary text-lg">
            총 {totalLikes}개의 프로젝트를 좋아요했습니다
          </p>
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {likedProjects.length > 0 ? (
          <div className="masonry-grid">
            {likedProjects.map((project) => (
              <ImageCard key={project.id} props={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              좋아요한 프로젝트가 없습니다
            </h2>
            <p className="text-secondary mb-8">
              마음에 드는 프로젝트에 좋아요를 눌러보세요
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
