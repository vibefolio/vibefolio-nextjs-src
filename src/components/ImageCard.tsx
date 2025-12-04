// src/components/ImageCard.tsx

"use client";

import React, { forwardRef } from "react"; // 🚨 forwardRef 임포트
import { Heart } from "lucide-react";
import { addCommas } from "@/lib/format/comma";

// Props 인터페이스 정의
interface ImageCardProps {
  props: {
    id: string;
    urls: { regular: string };
    user: {
      username: string;
      profile_image: { large: string };
    };
    likes: number;
  } | null;
}

// 🚨🚨🚨 forwardRef를 사용하여 컴포넌트를 래핑하고 ref와 나머지 props를 받습니다. 🚨🚨🚨
export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ props, ...rest }, ref) => {
    if (!props) return null;

    return (
      // 🚨 ref와 DialogTrigger에서 전달된 나머지 props(onClick 등)를 최상위 div에 전달합니다.
      <div
        className="w-full flex flex-col gap-2 cursor-pointer"
        ref={ref}
        {...rest} // DialogTrigger에서 전달되는 onClick, onKeyDown 등을 받음
      >
        <img
          src={props.urls.regular}
          alt="@THUMBNAIL"
          className="w-full aspect-square rounded-sm object-cover"
        />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={props.user.profile_image.large}
              alt="@PROFILE_IMAGE"
              className="w-7 h-7 rounded-full"
            />
            <p className="text-sm">{props.user.username}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={16} className="text-red-400" fill="#f87171" />
              <p className="text-sm">{addCommas(props.likes)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// * index.ts에서 export * from "./ImageCard"를 사용하므로 추가 export는 필요 없습니다.
