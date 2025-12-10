"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Send,
  User,
  MoreHorizontal,
} from "lucide-react";
import { addCommas } from "@/lib/format/comma";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

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
  const [comment, setComment] = useState("");
  // 임시 댓글 데이터 (나중엔 props나 API 로딩 필요)
  const [comments, setComments] = useState<any[]>([]);

  if (!project) return null;

  const handleLike = () => setLiked(!liked);
  const handleBookmark = () => setBookmarked(!bookmarked);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "나", // 실제로는 로그인 유저 정보 필요
      text: comment,
      created_at: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-full h-full p-0 bg-[#111] border-none text-white overflow-hidden sm:rounded-none">
        {/* 전체 레이아웃 컨테이너 */}
        <div className="relative w-full h-full flex flex-col md:flex-row">
          
          {/* 커스텀 닫기 버튼 */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 z-[60] p-2 text-white/50 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* 1. 메인 이미지 영역 (중앙) - 스크롤 가능 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-10 px-4 md:px-20">
             {/* 닫기 버튼은 Dialog의 기본 Close 버튼이 우측 상단에 있음 (shadcn default)
                 하지만 커스텀 디자인을 위해 숨기거나 스타일링 할 수 있음. 
                 여기서는 기본 Close 버튼을 사용하되, 배경이 어두우므로 잘 보이게 css 조정 필요할 수 있음. 
                 (DialogContent의 className에 text-white 넣었으므로 X 아이콘도 흰색으로 나올 것임)
             */}
             
            <div className="w-full max-w-4xl">
              {/* 작성자 정보 헤더 (이미지 위) */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-white/10">
                    <AvatarImage src={project.user.profile_image.large} alt={project.user.username} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-semibold text-white leading-none mb-1">
                      {project.user.username}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {dayjs(project.created_at).fromNow()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <MoreHorizontal />
                </Button>
              </div>

              {/* 이미지 */}
              <div className="w-full bg-black/50 rounded-lg overflow-hidden mb-8 shadow-2xl border border-white/5">
                <img
                  src={project.urls.full}
                  alt={project.alt_description || "Project Image"}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* 설명 텍스트 */}
              <div className="mb-20">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                      {project.description || "설명이 없습니다."}
                  </p>
              </div>

              {/* 댓글 섹션 (하단 중앙) */}
              <div className="w-full max-w-2xl mx-auto border-t border-white/10 pt-8" id="comment-section">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    댓글 <span className="text-[#4ACAD4]">{comments.length}</span>
                </h4>
                
                {/* 댓글 입력 */}
                <div className="flex gap-4 mb-8">
                    <Avatar className="w-10 h-10">
                        {/* 로그인 유저 프로필 이미지 필요 */}
                        <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-white/5 rounded-xl p-4 focus-within:ring-1 focus-within:ring-[#4ACAD4] transition-all">
                        <Textarea 
                            placeholder="창작자에게 응원의 메시지를 남겨보세요."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                }
                            }}
                            className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-500 min-h-[60px] resize-none"
                        />
                        <div className="flex justify-end mt-2">
                            <Button 
                                size="sm" 
                                onClick={handleCommentSubmit}
                                disabled={!comment.trim()}
                                className="bg-[#4ACAD4] hover:bg-[#3dbdc6] text-white"
                            >
                                등록
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-6">
                    {comments.map((c, i) => (
                        <div key={i} className="flex gap-4 group">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback>{c.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-semibold text-white">{c.user}</span>
                                    <span className="text-xs text-gray-500">{dayjs(c.created_at).fromNow()}</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-gray-500 py-10">
                            첫 번째 댓글을 남겨주세요!
                        </p>
                    )}
                </div>
              </div>

            </div>
          </div>

          {/* 2. 플로팅 액션 사이드바 (우측 고정) */}
          <div className="hidden md:flex flex-col gap-4 fixed right-10 top-1/2 -translate-y-1/2 z-50">
             {/* 프로필 바로가기 */}
             <div className="group relative">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-12 h-12 rounded-full border-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    onClick={() => window.open(`/creator/${project.user.username}`, '_blank')}
                >
                    <Avatar className="w-full h-full">
                        <AvatarImage src={project.user.profile_image.large} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                </Button>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    창작자 프로필
                </div>
             </div>

             {/* 제안하기 */}
             <div className="group relative">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-12 h-12 rounded-full border-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                    <Send size={20} />
                </Button>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    제안하기
                </div>
             </div>

             <div className="w-8 h-[1px] bg-white/10 mx-auto my-2" />

             {/* 댓글 */}
             <div className="group relative">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-12 h-12 rounded-full border-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    onClick={() => {
                        const el = document.getElementById('comment-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <MessageCircle size={20} />
                </Button>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    댓글
                </div>
             </div>

             {/* 공유 */}
             <div className="group relative">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-12 h-12 rounded-full border-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("링크가 복사되었습니다!");
                    }}
                >
                    <Share2 size={20} />
                </Button>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    공유하기
                </div>
             </div>

             {/* 좋아요 */}
             <div className="group relative text-center">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className={`w-12 h-12 rounded-full border-none backdrop-blur-sm transition-colors ${liked ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    onClick={handleLike}
                >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                </Button>
                <span className="text-xs text-white/80 mt-1 block font-medium">{addCommas(project.likes + (liked ? 1 : 0))}</span>
             </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
