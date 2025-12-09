// src/app/creator/[username]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ImageCard } from "@/components/ImageCard";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Link as LinkIcon,
  Mail,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  profileImage: string;
  skills: string[];
  socialLinks: {
    instagram?: string;
    behance?: string;
    linkedin?: string;
  };
}

interface ImageDialogProps {
  id: string;
  urls: { full: string; regular: string };
  user: {
    username: string;
    profile_image: { small: string; large: string };
  };
  likes: number;
  description: string | null;
  alt_description: string | null;
  created_at: string;
  width: number;
  height: number;
  category: string;
}

export default function CreatorProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ImageDialogProps[]>([]);
  const [selectedProject, setSelectedProject] = useState<ImageDialogProps | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // 프로필 불러오기 (실제로는 API 호출)
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      if (parsedProfile.username === username) {
        setProfile(parsedProfile);
      }
    }

    // 해당 제작자의 프로젝트 불러오기
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      const filtered = parsedProjects.filter(
        (p: ImageDialogProps) => p.user.username === username
      );
      setProjects(filtered);
    }
  }, [username]);

  const handleCardClick = (project: ImageDialogProps) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            뒤로 가기
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* 프로필 이미지 */}
            <Avatar className="w-32 h-32">
              <img
                src={profile?.profileImage || "/globe.svg"}
                alt={username}
                className="w-full h-full object-cover"
              />
            </Avatar>

            {/* 프로필 정보 */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {username}
              </h1>
              {profile?.bio && (
                <p className="text-lg text-gray-600 mb-4">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 mb-4">
                {profile?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              {/* 스킬 */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">
                    스킬
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#4ACAD4] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 소셜 링크 */}
              <div className="flex gap-3">
                {profile?.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(profile.website, "_blank")}
                  >
                    <LinkIcon size={16} className="mr-2" />
                    웹사이트
                  </Button>
                )}
                {profile?.socialLinks?.instagram && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(profile.socialLinks.instagram, "_blank")
                    }
                  >
                    <Instagram size={16} className="mr-2" />
                    Instagram
                  </Button>
                )}
                {profile?.socialLinks?.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(profile.socialLinks.linkedin, "_blank")
                    }
                  >
                    <Linkedin size={16} className="mr-2" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-6 max-w-md">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {projects.length}
              </p>
              <p className="text-sm text-gray-600">프로젝트</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + p.likes, 0)}
              </p>
              <p className="text-sm text-gray-600">좋아요</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">팔로워</p>
            </div>
          </div>
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          프로젝트 ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">
              아직 등록된 프로젝트가 없습니다
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {projects.map((project, index) => (
              <ImageCard
                key={index}
                props={project}
                onClick={() => handleCardClick(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 프로젝트 상세 모달 */}
      <ProjectDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        project={selectedProject}
      />
    </div>
  );
}
