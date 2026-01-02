"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { User, Upload, LogOut } from 'lucide-react';
import { useAuth } from "@/lib/auth/AuthContext";

export function AuthButtons() {
  const router = useRouter();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 상태 추적
  useEffect(() => {
    setMounted(true);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await signOut();
  };

  // 마운트 전이나 세션 로드 중에는 최소한의 레이아웃 유지
  if (!mounted || loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // 로그인된 상태
  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-9 h-9 cursor-pointer border border-gray-100 hover:border-green-500 transition-all">
            <AvatarImage 
              src={user.user_metadata?.avatar_url || "/globe.svg"} 
              alt="User" 
              className="object-cover" 
            />
            <AvatarFallback className="bg-gray-50 text-gray-400">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 mt-2 rounded-2xl p-2 shadow-xl border-gray-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user.user_metadata?.nickname || user.email?.split('@')[0]}
            </p>
            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
          </div>
          <DropdownMenuSeparator className="bg-gray-50" />
          <DropdownMenuItem onClick={() => router.push('/project/upload')} className="cursor-pointer rounded-lg py-2">
            <Upload className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-sm">프로젝트 등록</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/mypage')} className="cursor-pointer rounded-lg py-2">
            <User className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-sm">마이페이지</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-50" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg py-2 text-red-500 focus:text-red-500 focus:bg-red-50">
            <LogOut className="mr-2 h-4 w-4 text-red-400" />
            <span className="text-sm font-medium">로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 로그인되지 않은 상태
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" className="text-gray-600 hover:bg-gray-50 rounded-full px-5 text-sm font-semibold">
        <Link href="/login">로그인</Link>
      </Button>
      <Button asChild className="btn-primary rounded-full px-6 text-sm font-bold shadow-sm">
        <Link href="/signup">회원가입</Link>
      </Button>
    </div>
  );
}
