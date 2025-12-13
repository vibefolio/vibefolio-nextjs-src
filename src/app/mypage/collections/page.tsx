"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, ChevronRight } from "lucide-react";
import { ImageCard } from "@/components/ImageCard";
import { supabase } from "@/lib/supabase/client";

interface Collection {
  collection_id: string;
  name: string;
  description: string;
  created_at: string;
  item_count?: number;
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionProjects, setCollectionProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/collections', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        // 각 컬렉션의 아이템 개수 가져오기
        const collectionsWithCount = await Promise.all(
          (data.collections || []).map(async (collection: Collection) => {
            const { count } = await supabase
              .from('CollectionItem')
              .select('*', { count: 'exact', head: true })
              .eq('collection_id', collection.collection_id);
            
            return { ...collection, item_count: count || 0 };
          })
        );
        
        setCollections(collectionsWithCount);
      }
    } catch (error) {
      console.error('컬렉션 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionProjects = async (collectionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('CollectionItem')
        .select(`
          project_id,
          added_at,
          Project (*)
        `)
        .eq('collection_id', collectionId)
        .order('added_at', { ascending: false });

      if (error) throw error;

      const projects = data?.map(item => ({
        ...item.Project,
        added_at: item.added_at
      })) || [];

      setCollectionProjects(projects);
    } catch (error) {
      console.error('컬렉션 프로젝트 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (collectionId: string) => {
    setSelectedCollection(collectionId);
    loadCollectionProjects(collectionId);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    setCollectionProjects([]);
  };

  if (loading && collections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ACAD4] mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          {selectedCollection ? (
            <button
              onClick={handleBackToCollections}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronRight size={20} className="rotate-180" />
              <span className="ml-2">컬렉션 목록으로</span>
            </button>
          ) : (
            <h1 className="text-3xl font-bold">내 컬렉션</h1>
          )}
        </div>

        {/* 컬렉션 목록 또는 프로젝트 */}
        {!selectedCollection ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <button
                  key={collection.collection_id}
                  onClick={() => handleCollectionClick(collection.collection_id)}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#4ACAD4] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Folder size={24} className="text-[#4ACAD4]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{collection.description}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {collection.item_count}개의 프로젝트
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Folder size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">컬렉션이 없습니다</p>
                <p className="text-sm text-gray-500">프로젝트를 저장하여 컬렉션을 만들어보세요!</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ACAD4] mx-auto"></div>
              </div>
            ) : collectionProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collectionProjects.map((project) => (
                  <ImageCard
                    key={project.project_id}
                    id={project.project_id.toString()}
                    imageUrl={project.image_url}
                    title={project.title}
                    description={project.description}
                    user={{
                      username: project.user?.nickname || 'Unknown',
                      profile_image: { small: project.user?.profile_image_url || '/globe.svg' }
                    }}
                    likes={project.likes_count || 0}
                    views={project.views_count || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600">이 컬렉션에 저장된 프로젝트가 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
