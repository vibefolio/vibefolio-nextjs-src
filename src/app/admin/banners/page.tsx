"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

export default function AdminBannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageType, setPageType] = useState<"discover" | "connect">("discover");
  const [formData, setFormData] = useState({
    title: "",
    link_url: "",
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 관리자 확인
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const { data: admin } = await (supabase as any)
        .from("Admin")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!admin) {
        alert("관리자 권한이 필요합니다.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
      loadBanners();
    };

    checkAdmin();
  }, [router]);

  // 배너 목록 로드
  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/banners?pageType=${pageType}`);
      const data = await res.json();
      
      if (res.ok) {
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error("배너 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [pageType]);

  useEffect(() => {
    if (isAdmin) {
      loadBanners();
    }
  }, [isAdmin, pageType, loadBanners]);

  // 이미지 드래그앤드롭
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 배너 저장
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile && !editingId) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "banners");
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
        page_type: pageType,
      };

      const url = editingId ? `/api/banners/${editingId}` : "/api/banners";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? "배너가 수정되었습니다." : "배너가 추가되었습니다.");
        setFormData({ title: "", link_url: "", display_order: 0 });
        setImageFile(null);
        setPreviewImage(null);
        setEditingId(null);
        loadBanners();
      } else {
        const error = await res.json();
        alert(error.error || "배너 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("배너 저장 실패:", error);
      alert("배너 저장 중 오류가 발생했습니다.");
    }
  };

  // 배너 삭제
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        alert("배너가 삭제되었습니다.");
        loadBanners();
      }
    } catch (error) {
      console.error("배너 삭제 실패:", error);
    }
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">배너 관리</h1>

        {/* 페이지 타입 선택 */}
        <div className="mb-6 flex gap-4">
          <Button
            variant={pageType === "discover" ? "default" : "outline"}
            onClick={() => setPageType("discover")}
          >
            발견 페이지
          </Button>
          <Button
            variant={pageType === "connect" ? "default" : "outline"}
            onClick={() => setPageType("connect")}
          >
            연결 페이지
          </Button>
        </div>

        {/* 배너 추가 폼 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow">
          <h2 className="text-xl font-bold mb-4">{editingId ? "배너 수정" : "배너 추가"}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 드래그앤드롭 영역 */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4ACAD4] transition-colors cursor-pointer"
            >
              {previewImage ? (
                <div className="relative">
                  <img src={previewImage} alt="Preview" className="max-h-64 mx-auto" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewImage(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button type="button" className="mt-4">파일 선택</Button>
                  </label>
                </div>
              )}
            </div>

            <Input
              placeholder="배너 제목"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              placeholder="링크 URL (선택사항)"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            />

            <Input
              type="number"
              placeholder="표시 순서"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            />

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "수정" : "추가"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: "", link_url: "", display_order: 0 });
                    setImageFile(null);
                    setPreviewImage(null);
                  }}
                >
                  취소
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* 배너 목록 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold mb-4">배너 목록</h2>
          
          {loading ? (
            <p>로딩 중...</p>
          ) : banners.length === 0 ? (
            <p className="text-gray-500">배너가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div key={banner.banner_id} className="border rounded-lg p-4">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold">{banner.title}</h3>
                  <p className="text-sm text-gray-500">순서: {banner.display_order}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(banner.banner_id);
                        setFormData({
                          title: banner.title,
                          link_url: banner.link_url || "",
                          display_order: banner.display_order,
                        });
                        setPreviewImage(banner.image_url);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(banner.banner_id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
