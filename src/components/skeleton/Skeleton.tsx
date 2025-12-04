// src/components/skeleton/skeleton.tsx

import React from "react";
// 🚨 상위 components/ui 폴더에서 Skeleton 컴포넌트를 임포트합니다.
import { Skeleton } from "@/components/ui/skeleton";
import { ChartNoAxesColumnIncreasing, Heart } from "lucide-react";

/**
 * ImageCard 컴포넌트의 로딩 상태를 표시하는 스켈레톤 UI입니다.
 * 이 파일은 여러 스켈레톤 컴포넌트들을 모아두는 역할을 합니다.
 */
export function SkeletonImageCard() {
  return (
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="w-full aspect-square" />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-12 h-4" />
        </div>
        <div className="flex items-center gap-3">
          {/* 조회수 스켈레톤 */}
          <div className="flex items-center gap-1">
            <ChartNoAxesColumnIncreasing
              size={18}
              className="text-neutral-400"
            />
            <Skeleton className="w-8 h-4" />
          </div>
          {/* 좋아요 스켈레톤 */}
          <div className="flex items-center gap-1">
            <Heart size={18} className="text-neutral-400" />
            <Skeleton className="w-8 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
