// src/components/Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

export const VibeLogo = ({ className = "h-8", showText = true }: LogoProps) => {
  // 고유한 ID를 사용하여 그라디언트 충돌 방지
  const gradientId = "vibe_logo_gradient_auth";
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 50 50"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#16A34A" />
            <stop offset="1" stopColor="#84CC16" />
          </linearGradient>
        </defs>
        <g transform="translate(0, 0)">
          <path
            d="M10 5H40C45.5228 5 50 9.47715 50 15V29C50 34.5228 45.5228 39 40 39H30L20 46V39H10C4.47715 39 0 34.5228 0 29V15C0 9.47715 4.47715 5 10 5Z"
            fill={`url(#${gradientId})`}
          />
          <path
            d="M16 16L25 30L34 16"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      {showText && (
        <span 
          style={{ fontFamily: "'Inter', sans-serif" }} 
          className="font-[900] text-[20px] tracking-tighter text-[#111827]"
        >
          VIBE<span className="font-normal">FOLIO</span>
        </span>
      )}
    </div>
  );
};
