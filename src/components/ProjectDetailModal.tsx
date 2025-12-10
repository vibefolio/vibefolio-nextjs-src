"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Send,
  User,
  MoreHorizontal,
  X,
} from "lucide-react";
import { addCommas } from "@/lib/format/comma";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { CommentModal } from "./CommentModal";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
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
  } | null;
}

export function ProjectDetailModal({
  open,
  onOpenChange,
  project,
}: ProjectDetailModalProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  if (!project) return null;

  const handleLike = () => setLiked(!liked);
  const handleBookmark = () => setBookmarked(!bookmarked);

  const handleAddComment = (text: string) => {
    const newComment = {
      id: Date.now(),
      user: "나", 
      text: text,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
            className="max-w-none w-screen h-screen bg-transparent border-none shadow-none p-0 !animate-none !duration-0 data-[state=open]:!fade-in-0 data-[state=closed]:!fade-out-0"
            showCloseButton={false} 
        >
          {/* 전체 컨테이너: 배경 클릭 시 닫기(DialogOverlay가 하지만, 여기서 레이아웃 잡음) */}
          <div className="w-full h-full overflow-y-auto" onClick={(e) => {
              if (e.target === e.currentTarget) onOpenChange(false);
          }}>
            
            {/* 우측 상단 닫기 버튼 (화면 고정) */}
            <button 
                onClick={() => onOpenChange(false)}
                className="fixed top-6 right-6 z-[60] p-2 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full backdrop-blur-md"
            >
                <X size={32} />
            </button>

            {/* 메인 컨텐츠 (흰색 종이 스타일) */}
            <div className="w-full max-w-[1000px] min-h-screen bg-white mx-auto my-0 md:my-10 relative shadow-2xl flex flex-col pt-10 pb-20 px-8 md:px-16" onClick={(e) => e.stopPropagation()}>
                
                {/* 헤더: 작성자 정보 및 제목 */}
                <div className="mb-8 border-b pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <Link href={`/creator/${project.user.username}`} className="flex items-center gap-3 group">
                            <Avatar className="w-12 h-12 border border-gray-100">
                                <AvatarImage src={project.user.profile_image.large} alt={project.user.username} />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#4ACAD4] transition-colors">
                                    {project.description ? (project.description.length > 30 ? project.description.slice(0, 30) + "..." : project.description) : "무제 프로젝트"}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    {project.user.username} · <span className="text-[#4ACAD4]">팔로우</span>
                                </p>
                            </div>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            {/* 오른쪽 상단 뱃지 등 (예: NP) */} 
                            <div className="bg-[#4ACAD4] text-white text-xs font-bold px-2 py-3 rounded-b-sm -mt-10 mr-4 shadow-md">
                                D
                            </div>
                        </div>
                    </div>
                </div>

                {/* 메인 이미지 */}
                <div className="w-full mb-10 flex justify-center bg-gray-50/50">
                    <img
                        src={project.urls.full}
                        alt={project.alt_description || "Project Image"}
                        className="w-auto max-w-full h-auto object-contain shadow-sm"
                    />
                </div>

                {/* 설명 텍스트 */}
                <div className="mb-20 max-w-3xl mx-auto w-full">
                    <p className="text-gray-800 leading-loose text-lg whitespace-pre-wrap">
                        {project.description || "설명이 없습니다."}
                    </p>
                </div>

                {/* 하단 태그/정보 영역 (예시) */}
                <div className="border-t pt-10 text-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} {project.user.username}. All rights reserved.</p>
                </div>

            </div>

            {/* 우측 플로팅 액션바 (화면 고정) */}
            <div className="hidden md:flex flex-col gap-6 fixed right-[calc(50%-640px)] top-1/2 -translate-y-1/2 z-50 translate-x-full ml-10">
                {/* 프로필 */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => window.open(`/creator/${project.user.username}`, '_blank')}>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all ring-1 ring-white/20">
                        <img src={project.user.profile_image.large} alt="profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">프로필</span>
                </div>

                {/* 제안하기 */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#4ACAD4] transition-colors">
                        <Send size={20} />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">제안하기</span>
                </div>

                {/* 좋아요 */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={handleLike}>
                    <div className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${liked ? 'bg-red-500 text-white' : 'bg-gray-800/80 text-white hover:bg-red-500'}`}>
                        <Heart size={20} fill={liked ? "currentColor" : "none"} />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium">{addCommas(project.likes + (liked ? 1 : 0))}</span>
                </div>

                {/* 컬렉션 (북마크) */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={handleBookmark}>
                    <div className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${bookmarked ? 'bg-blue-500 text-white' : 'bg-gray-800/80 text-white hover:bg-blue-500'}`}>
                        <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">컬렉션</span>
                </div>

                {/* 댓글 (모달 오픈) */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => setCommentModalOpen(true)}>
                    <div className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                        <MessageCircle size={20} />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium">댓글</span>
                </div>

                {/* 공유하기 */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("링크가 복사되었습니다!");
                }}>
                    <div className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                        <Share2 size={20} />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">공유하기</span>
                </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 모달 (따로 뜸) */}
      <CommentModal 
        open={commentModalOpen} 
        onOpenChange={setCommentModalOpen}
        comments={comments}
        onAddComment={handleAddComment}
        isLoggedIn={true} // 실제로는 상위 auth state 받아야 함
      />
    </>
  );
}
