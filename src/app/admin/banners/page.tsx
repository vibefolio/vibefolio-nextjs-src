// src/app/admin/banners/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Upload, Plus } from "lucide-react";

interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  link?: string;
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState({
    title: "",
    imageUrl: "",
    link: "",
  });

  // 로컬 스토리지에서 배너 불러오기
  useEffect(() => {
    const savedBanners = localStorage.getItem("banners");
    if (savedBanners) {
      setBanners(JSON.parse(savedBanners));
    } else {
      // 기본 배너 설정
      const defaultBanners = [
        { id: 1, imageUrl: "/window.svg", title: "배너 1" },
        { id: 2, imageUrl: "/file.svg", title: "배너 2" },
        { id: 3, imageUrl: "/next.svg", title: "배너 3" },
        { id: 4, imageUrl: "/globe.svg", title: "배너 4" },
      ];
      setBanners(defaultBanners);
      localStorage.setItem("banners", JSON.stringify(defaultBanners));
    }
  }, []);

  // 배너 추가
  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.imageUrl) {
      alert("제목과 이미지 URL을 입력해주세요.");
      return;
    }

    const banner: Banner = {
      id: Date.now(),
      title: newBanner.title,
      imageUrl: newBanner.imageUrl,
      link: newBanner.link,
    };

    const updatedBanners = [...banners, banner];
    setBanners(updatedBanners);
    localStorage.setItem("banners", JSON.stringify(updatedBanners));

    // 입력 필드 초기화
    setNewBanner({ title: "", imageUrl: "", link: "" });
  };

  // 배너 삭제
  const handleDeleteBanner = (id: number) => {
    const updatedBanners = banners.filter((banner) => banner.id !== id);
    setBanners(updatedBanners);
    localStorage.setItem("banners", JSON.stringify(updatedBanners));
  };

  // 이미지 파일 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBanner({ ...newBanner, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            배너 관리
          </h1>
          <p className="text-gray-600">
            메인 페이지에 표시될 배너를 관리합니다.
          </p>
        </div>

        {/* 배너 추가 폼 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">새 배너 추가</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배너 제목
                </label>
                <Input
                  placeholder="배너 제목을 입력하세요"
                  value={newBanner.title}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 (선택사항)
                </label>
                <Input
                  placeholder="https://example.com"
                  value={newBanner.link}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, link: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 URL 또는 파일 업로드
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="이미지 URL을 입력하세요"
                    value={newBanner.imageUrl}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, imageUrl: e.target.value })
                    }
                    className="flex-1"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload size={18} className="mr-2" />
                        파일 선택
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
              {newBanner.imageUrl && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    미리보기
                  </p>
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={newBanner.imageUrl}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={handleAddBanner}
              className="mt-4 bg-[#4ACAD4] hover:bg-[#41a3aa]"
            >
              <Plus size={18} className="mr-2" />
              배너 추가
            </Button>
          </CardContent>
        </Card>

        {/* 배너 목록 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            현재 배너 ({banners.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="h-48 bg-gray-100">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{banner.title}</h3>
                  {banner.link && (
                    <p className="text-sm text-gray-500 mb-3 truncate">
                      {banner.link}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    삭제
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {banners.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>등록된 배너가 없습니다.</p>
              <p className="text-sm mt-2">위 폼을 사용하여 배너를 추가하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
