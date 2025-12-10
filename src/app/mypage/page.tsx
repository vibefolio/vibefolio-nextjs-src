// src/app/mypage/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Bookmark, User, Upload, Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTotalLikesCount } from "@/lib/likes";
import { getTotalBookmarksCount } from "@/lib/bookmarks";

import { supabase } from "@/lib/supabase/client";
// ... imports

export default function MyPage() {
  const router = useRouter();
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [userNickname, setUserNickname] = useState("사용자");

  useEffect(() => {
    const fetchStats = async () => {
      // 현재 로그인한 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // 비로그인 상태면 로그인 페이지로 리다이렉트
        router.push('/login');
        return;
      }

      // 1. 좋아요 수 조회
      const { count: likesCount } = await supabase
        .from('Like')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // 2. 북마크 수 조회
      const { count: bookmarksCount } = await supabase
        .from('Wishlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // 3. 내 프로젝트 수 조회
      const { count: projectsCount } = await supabase
        .from('Project')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      // 4. 사용자 닉네임 조회
      const { data: userData } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', user.id)
        .single() as { data: any, error: any }; // 타입 단언 추가

      setTotalLikes(likesCount || 0);
      setTotalBookmarks(bookmarksCount || 0);
      setTotalProjects(projectsCount || 0);
      if (userData?.nickname) setUserNickname(userData.nickname);
    };

    fetchStats();
  }, [router]);

  const menuItems = [
    {
      icon: Heart,
      title: "좋아요한 프로젝트",
      description: `${totalLikes}개의 프로젝트`,
      color: "text-red-500",
      bgColor: "bg-red-50",
      path: "/mypage/likes",
    },
    {
      icon: Bookmark,
      title: "북마크한 프로젝트",
      description: `${totalBookmarks}개의 프로젝트`,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      path: "/mypage/bookmarks",
    },
    {
      icon: Upload,
      title: "내 프로젝트",
      description: `${totalProjects}개의 프로젝트`,
      color: "text-green-500",
      bgColor: "bg-green-50",
      path: "/mypage/projects",
    },
    {
      icon: User,
      title: "프로필 설정",
      description: "내 정보 및 프로필 관리",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      path: "/mypage/profile",
    },
    {
      icon: MessageCircle,
      title: "1:1 문의 내역",
      description: "보낸 문의 확인",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      path: "/mypage/inquiries",
    },
    {
      icon: Settings,
      title: "설정",
      description: "프로필 및 계정 설정",
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      path: "/mypage/settings",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24">
      {/* 헤더 */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                마이페이지
              </h1>
              <p className="text-secondary text-lg">
                내 활동과 프로젝트를 관리하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-subtle">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-red-500" size={24} />
              <h3 className="text-lg font-bold text-primary">좋아요</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{totalLikes}</p>
            <p className="text-sm text-secondary">개의 프로젝트</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-subtle">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-primary">북마크</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{totalBookmarks}</p>
            <p className="text-sm text-secondary">개의 프로젝트</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-subtle">
            <div className="flex items-center gap-3 mb-2">
              <Upload className="text-green-500" size={24} />
              <h3 className="text-lg font-bold text-primary">업로드</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{totalProjects}</p>
            <p className="text-sm text-secondary">개의 프로젝트</p>
          </div>
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-subtle hover:shadow-card transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`${item.bgColor} p-4 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={item.color} size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-secondary">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 빠른 액션 */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-subtle">
          <h2 className="text-xl font-bold text-primary mb-4">빠른 액션</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push("/project/upload")}
              className="btn-primary"
            >
              <Upload size={20} className="mr-2" />
              프로젝트 업로드
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="btn-secondary"
            >
              프로젝트 둘러보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
