// src/components/ProjectDetailModal.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  MessageCircle,
  Send,
  Bookmark,
  Eye,
} from "lucide-react";
import { addCommas } from "@/lib/format/comma";

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
  const [comments, setComments] = useState<
    Array<{ user: string; text: string; time: string }>
  >([]);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  if (!project) return null;

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.description || "프로젝트",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleInquirySubmit = () => {
    if (inquiryMessage.trim()) {
      // 로컬 스토리지에 문의 저장
      const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
      inquiries.push({
        id: Date.now(),
        projectId: project.id,
        projectTitle: project.description || "제목 없음",
        creator: project.user.username,
        message: inquiryMessage,
        date: new Date().toISOString(),
        status: "pending",
      });
      localStorage.setItem("inquiries", JSON.stringify(inquiries));
      
      alert(`${project.user.username}님에게 문의가 전송되었습니다!`);
      setInquiryMessage("");
      setInquiryOpen(false);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          user: "현재 사용자",
          text: comment,
          time: "방금 전",
        },
      ]);
      setComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-[1.5fr,1fr] gap-0">
          {/* 왼쪽: 이미지 영역 */}
          <div className="bg-gray-100 flex items-center justify-center p-8">
            <img
              src={project.urls.full}
              alt={project.alt_description || "프로젝트 이미지"}
              className="w-full h-auto object-contain max-h-[70vh]"
            />
          </div>

          {/* 오른쪽: 정보 및 인터랙션 영역 */}
          <div className="flex flex-col h-full">
            {/* 헤더 */}
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <img
                      src={project.user.profile_image.large}
                      alt={project.user.username}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <Link href={`/creator/${project.user.username}`}>
                      <DialogTitle className="text-lg font-semibold hover:text-[#4ACAD4] transition-colors cursor-pointer">
                        {project.user.username}
                      </DialogTitle>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={liked ? "text-red-500" : ""}
                >
                  <Heart
                    size={20}
                    fill={liked ? "currentColor" : "none"}
                    className="mr-1"
                  />
                  {addCommas(project.likes + (liked ? 1 : 0))}
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye size={20} className="mr-1" />
                  {addCommas(Math.floor(Math.random() * 10000))}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className={bookmarked ? "text-blue-500" : ""}
                >
                  <Bookmark
                    size={20}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            <Separator />

            {/* 설명 */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              <h3 className="font-semibold mb-2">프로젝트 설명</h3>
              <p className="text-sm text-gray-700">
                {project.description ||
                  project.alt_description ||
                  "설명이 없습니다."}
              </p>

              {/* 댓글 섹션 */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle size={18} />
                  댓글 {comments.length}
                </h3>
                <div className="space-y-4">
                  {comments.map((c, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                          {c.user[0]}
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {c.user}
                          </span>
                          <span className="text-xs text-gray-500">
                            {c.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* 하단: 1:1 문의 및 댓글 입력 */}
            <div className="p-6 space-y-3">
              <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#4ACAD4] hover:bg-[#41a3aa]">
                    <Send size={18} className="mr-2" />
                    1:1 문의하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {project.user.username}님에게 문의하기
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        문의 내용
                      </label>
                      <Textarea
                        placeholder="프로젝트에 대해 궁금한 점을 작성해주세요..."
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setInquiryOpen(false)}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={handleInquirySubmit}
                        disabled={!inquiryMessage.trim()}
                        className="bg-[#4ACAD4] hover:bg-[#41a3aa]"
                      >
                        전송
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex gap-2">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim()}
                  size="icon"
                  className="self-end"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
