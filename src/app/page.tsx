// src/app/page.tsx

"use client"; // 🚨 StickyMenu의 카테고리 상태 관리를 위해 "use client"가 필수입니다.

import { useState, useEffect } from "react"; // 🚨 상태 관리를 위해 useState, useEffect 임포트
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainBanner } from "@/components/MainBanner";
import { ImageCard } from "@/components/ImageCard"; // ImageCard 사용
import { StickyMenu } from "@/components/StickyMenu"; // 🚨 StickyMenu 임포트
import { ProjectDetailModal } from "@/components/ProjectDetailModal"; // 🚨 ProjectDetailModal 임포트

// 🚨 임시 ImageCard Props 타입 정의 (StickyMenu와의 연결을 위해 value를 추가)
interface ImageDialogProps {
  id: string;
  urls: { full: string; regular: string };
  user: { username: string; profile_image: { small: string; large: string } };
  likes: number;
  description: string | null;
  alt_description: string | null;
  created_at: string;
  width: number;
  height: number;
  // 🚨 임시로 카테고리 필터링을 위한 'category' 속성을 추가합니다.
  category: string;
}

// 🚨 임시 더미 데이터 생성 (카테고리 데이터 추가)
const DUMMY_IMAGES: ImageDialogProps[] = [
  // StickyMenu의 '전체' (korea)에 해당하는 데이터
  {
    id: "1",
    urls: {
      regular: "/window.svg",
      full: "/window.svg",
    },
    user: {
      username: "creator1",
      profile_image: {
        large: "/globe.svg",
        small: "/globe.svg",
      },
    },
    likes: 1234,
    description: "전체 카테고리 이미지 1",
    alt_description: "설명",
    created_at: "2023-01-01",
    width: 1000,
    height: 1000,
    category: "korea",
  },
  // StickyMenu의 'AI' (ai)에 해당하는 데이터
  {
    id: "2",
    urls: {
      regular: "/file.svg",
      full: "/file.svg",
    },
    user: {
      username: "creator2",
      profile_image: {
        large: "/globe.svg",
        small: "/globe.svg",
      },
    },
    likes: 987,
    description: "AI 카테고리 이미지 1",
    alt_description: "설명",
    created_at: "2023-01-02",
    width: 1000,
    height: 1000,
    category: "ai",
  },
  {
    id: "3",
    urls: {
      regular: "/next.svg",
      full: "/next.svg",
    },
    user: {
      username: "creator3",
      profile_image: {
        large: "/globe.svg",
        small: "/globe.svg",
      },
    },
    likes: 456,
    description: "전체 카테고리 이미지 2",
    alt_description: "설명",
    created_at: "2023-01-03",
    width: 1000,
    height: 1000,
    category: "korea",
  },

  // 나머지 데이터는 'video' 카테고리에 할당
  ...Array(9)
    .fill(0)
    .map((_, i) => ({
      id: String(i + 4),
      urls: {
        regular: "/window.svg",
        full: "/window.svg",
      },
      user: {
        username: `creator${i + 4}`,
        profile_image: {
          large: "/globe.svg",
          small: "/globe.svg",
        },
      },
      likes: (i + 1) * 100,
      description: `영상/모션그래픽 이미지 ${i + 1}`,
      alt_description: `설명 ${i + 1}`,
      created_at: `2023-01-0${i + 4}`,
      width: 1000,
      height: 1000,
      category: "video",
    })),
];

export default function Home() {
  // StickyMenu의 초기값인 'korea'를 기본값으로 설정합니다.
  const [currentCategory, setCurrentCategory] = useState<string>("korea");
  const [projects, setProjects] = useState<ImageDialogProps[]>(DUMMY_IMAGES);
  const [selectedProject, setSelectedProject] = useState<ImageDialogProps | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [banners, setBanners] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  // 로컬 스토리지에서 프로젝트 불러오기
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem("projects");
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          // 최신 좋아요 수로 업데이트된 프로젝트 목록
          setProjects([...parsedProjects, ...DUMMY_IMAGES]);
        }
      } catch (error) {
        console.error("프로젝트 로딩 실패:", error);
      }
    };

    loadProjects();
    
    // 좋아요 변경 감지를 위한 interval (선택사항)
    const interval = setInterval(loadProjects, 1000);
    return () => clearInterval(interval);
  }, []);

  // 배너 불러오기
  useEffect(() => {
    const savedBanners = localStorage.getItem("banners");
    if (savedBanners) {
      const parsedBanners = JSON.parse(savedBanners);
      setBanners(parsedBanners.map((_: any, idx: number) => idx + 1));
    }
  }, []);

  // StickyMenu에서 호출할 카테고리 변경 핸들러 함수
  const handleSetCategory = (categoryValue: string) => {
    setCurrentCategory(categoryValue);
    console.log("카테고리 변경:", categoryValue);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (project: ImageDialogProps) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  // 프로젝트 등록 핸들러 (로그인 체크)
  const handleProjectUpload = () => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.username) {
        window.location.href = "/project/upload";
      } else {
        alert("프로젝트를 등록하려면 먼저 프로필을 설정해주세요.");
        window.location.href = "/mypage/profile";
      }
    } else {
      alert("프로젝트를 등록하려면 먼저 로그인해주세요.");
      window.location.href = "/login";
    }
  };

  // 현재 선택된 카테고리에 따라 이미지를 필터링합니다.
  const filteredImages = projects.filter(
    (image) => currentCategory === "korea" || image.category === currentCategory
  );

  return (
    <div className="w-full relative bg-gray-50">
      <main className="w-full flex flex-col items-center">
        {/* 1. 메인 배너 - 풀페이지 */}
        <div className="w-full px-0 py-8 bg-white">
          <MainBanner loading={false} gallery={banners} />
        </div>

        {/* 2. Sticky Menu - TopHeader + Header 아래 고정 */}
        <div className="w-full bg-white border-b border-gray-200 sticky top-[124px] md:top-[124px] z-30">
          <div className="max-w-7xl mx-auto px-6">
            <StickyMenu
              props={currentCategory}
              onSetCategory={handleSetCategory}
            />
          </div>
        </div>

        {/* 3. 프로젝트 그리드 - Masonry 레이아웃 */}
        <section className="w-full max-w-7xl px-6 mt-8">
          <div className="masonry-grid">
            {filteredImages.map((image, index) => (
              <ImageCard 
                key={index} 
                props={image} 
                onClick={() => handleCardClick(image)}
              />
            ))}
          </div>
        </section>

        {/* 프로젝트 상세 모달 */}
        <ProjectDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          project={selectedProject}
        />

        {/* 5. 회원가입 및 로그인 유도 영역 */}
        <div className="w-full max-w-7xl px-6 py-20">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              당신의 작품을 공유하세요
            </h2>
            <p className="text-secondary mb-8">
              바이브폴리오에서 포트폴리오를 만들고 전 세계와 연결되세요
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button
                  variant={"default"}
                  className="btn-primary"
                >
                  회원가입
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant={"outline"}
                  className="btn-secondary"
                >
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 플로팅 프로젝트 등록 버튼 - 비핸스 스타일 */}
      <button
        onClick={handleProjectUpload}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center justify-center gap-2 w-14 h-14 md:w-auto md:h-auto md:px-6 md:py-4 bg-black hover:bg-gray-800 text-white rounded-full md:rounded-lg shadow-card hover:shadow-hover transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        <span className="hidden md:inline font-semibold">프로젝트 등록</span>
      </button>
    </div>
  );
}
