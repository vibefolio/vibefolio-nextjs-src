// src/app/templates/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Loader2, Eye, Heart } from "lucide-react";

// 템플릿 카테고리
const TEMPLATE_CATEGORIES = [
  { id: "all", name: "전체", color: "bg-gray-100" },
  { id: "landing", name: "랜딩페이지", color: "bg-blue-100" },
  { id: "portfolio", name: "포트폴리오", color: "bg-purple-100" },
  { id: "ecommerce", name: "이커머스", color: "bg-green-100" },
  { id: "dashboard", name: "대시보드", color: "bg-orange-100" },
  { id: "blog", name: "블로그", color: "bg-pink-100" },
  { id: "saas", name: "SaaS", color: "bg-cyan-100" },
];

// 샘플 템플릿 데이터
const SAMPLE_TEMPLATES = [
  {
    id: 1,
    title: "모던 포트폴리오",
    category: "portfolio",
    preview_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    description: "크리에이터를 위한 미니멀한 포트폴리오 템플릿",
    views: 1234,
    likes: 89,
    tags: ["미니멀", "다크모드", "반응형"],
  },
  {
    id: 2,
    title: "스타트업 랜딩",
    category: "landing",
    preview_image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop",
    description: "스타트업을 위한 임팩트 있는 랜딩페이지",
    views: 2567,
    likes: 156,
    tags: ["그라데이션", "애니메이션", "CTA"],
  },
  {
    id: 3,
    title: "블로그 매거진",
    category: "blog",
    preview_image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop",
    description: "콘텐츠 중심의 깔끔한 블로그 템플릿",
    views: 987,
    likes: 67,
    tags: ["매거진", "타이포그래피", "이미지"],
  },
  {
    id: 4,
    title: "대시보드 UI",
    category: "dashboard",
    preview_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    description: "데이터 시각화가 돋보이는 대시보드",
    views: 1876,
    likes: 134,
    tags: ["차트", "다크테마", "관리자"],
  },
  {
    id: 5,
    title: "SaaS 프로덕트",
    category: "saas",
    preview_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
    description: "SaaS 제품을 위한 완벽한 랜딩 템플릿",
    views: 3421,
    likes: 245,
    tags: ["가격표", "기능소개", "FAQ"],
  },
  {
    id: 6,
    title: "이커머스 쇼핑몰",
    category: "ecommerce",
    preview_image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop",
    description: "상품 판매에 최적화된 쇼핑몰 템플릿",
    views: 4123,
    likes: 298,
    tags: ["상품목록", "장바구니", "결제"],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);

  useEffect(() => {
    // 실제 API 연동 시 여기서 데이터 로드
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-[#4ACAD4] to-[#05BCC6] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            프리미엄 디자인 템플릿
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            AI 시대의 창작자들을 위한 고품질 디자인 템플릿을 만나보세요.
            <br />
            바이브코딩으로 쉽게 커스터마이징하고 나만의 웹사이트를 만들 수 있습니다.
          </p>
          
          {/* 검색 */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="템플릿 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-6 text-gray-900 text-lg rounded-xl border-0 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="bg-white border-b sticky top-[44px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-[#4ACAD4] text-white"
                    : `${cat.color} text-gray-700 hover:bg-gray-200`
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 템플릿 그리드 */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            {filteredTemplates.length}개의 템플릿
          </p>
          <select className="px-4 py-2 border rounded-lg text-sm">
            <option>인기순</option>
            <option>최신순</option>
            <option>조회순</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* 프리뷰 이미지 */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={template.preview_image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                      <Eye size={16} className="mr-2" />
                      미리보기
                    </Button>
                    <Button size="sm" className="bg-[#4ACAD4] hover:bg-[#3db8c0]">
                      <ExternalLink size={16} className="mr-2" />
                      사용하기
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 제목 & 설명 */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* 통계 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {template.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {template.likes.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA 섹션 */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            나만의 템플릿을 공유해보세요
          </h2>
          <p className="text-gray-300 mb-8">
            바이브폴리오에서 당신의 디자인 템플릿을 판매하고 수익을 창출하세요.
          </p>
          <Button 
            size="lg" 
            className="bg-[#4ACAD4] hover:bg-[#3db8c0] text-white"
            onClick={() => router.push("/submission")}
          >
            템플릿 등록하기
          </Button>
        </div>
      </section>
    </div>
  );
}
