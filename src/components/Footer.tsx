"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const VibeLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 250 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vibe_gradient_footer" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#16A34A" /> 
        <stop offset="1" stopColor="#84CC16" />
      </linearGradient>
    </defs>
    <g transform="translate(0, -3) scale(1.15)">
      <path 
        d="M10 5H40C45.5228 5 50 9.47715 50 15V29C50 34.5228 45.5228 39 40 39H30L20 46V39H10C4.47715 39 0 34.5228 0 29V15C0 9.47715 4.47715 5 10 5Z" 
        fill="url(#vibe_gradient_footer)" 
      />
      <path d="M16 16L25 30L34 16" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <text x="70" y="35" fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="28" fill="currentColor" letterSpacing="-0.5">
      VIBE<tspan fontWeight="400" dx="0">FOLIO</tspan>
    </text>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <VibeLogo className="h-8 text-slate-800" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              AI 창작자를 위한 영감의 공간,<br />
              바이브폴리오에서 당신의 가능성을 발견하세요.
            </p>
            <div className="flex gap-4">
              {/* SNS 아이콘 (SVG로 대체) */}
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm-3.77 1.795c-.95.043-1.46.25-1.813.393a2.936 2.936 0 00-1.097.712 2.938 2.938 0 00-.712 1.097c-.143.353-.35.863-.393 1.813-.043.967-.053 1.258-.053 4.126 0 2.868.01 3.16.053 4.126.043.95.25 1.46.393 1.813a2.938 2.938 0 00.712 1.097 2.936 2.936 0 001.097.712c.353.143.863.35 1.813.393.967.043 1.258.053 4.126.053 2.868 0 3.16-.01 4.126-.053.95-.043 1.46-.25 1.813-.393a2.936 2.936 0 001.097-.712 2.938 2.938 0 00.712-1.097c.143-.353.35-.863.393-1.813.043-.967.053-1.258.053-4.126 0-2.868-.01-3.16-.053-4.126-.043-.95-.25-1.46-.393-1.813a2.938 2.938 0 00-.712-1.097 2.936 2.936 0 00-1.097-.712c-.353-.143-.863-.35-1.813-.393-.967-.043-1.258-.053-4.126-.053-2.868 0-3.16.01-4.126.053zM12 5.925a6.075 6.075 0 110 12.15 6.075 6.075 0 010-12.15zm0 1.95a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25z" clipRule="evenodd" /></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>

          {/* 링크 섹션들 */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">서비스</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/service" className="hover:text-green-600 transition-colors">서비스 소개</Link></li>
              <li><Link href="/ads" className="hover:text-green-600 transition-colors">광고 상품</Link></li>
              <li><Link href="/recruit" className="hover:text-green-600 transition-colors">파트너스</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4">고객지원</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/notices" className="hover:text-green-600 transition-colors">공지사항</Link></li>
              <li><Link href="/faq" className="hover:text-green-600 transition-colors">자주 묻는 질문</Link></li>
              <li><Link href="/contact" className="hover:text-green-600 transition-colors">문의하기</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4">정책</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/policy/terms" className="hover:text-green-600 transition-colors">이용약관</Link></li>
              <li><Link href="/policy/privacy" className="hover:text-green-600 transition-colors font-bold text-slate-700">개인정보처리방침</Link></li>
              <li><Link href="/policy/operation" className="hover:text-green-600 transition-colors">운영정책</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-200 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="text-center md:text-left">
            <p className="mb-2">
              (주)바이브폴리오 | 대표이사: 김창작 | 사업자등록번호: 123-45-67890<br />
              주소: 서울특별시 강남구 테헤란로 123, 4층 | 통신판매업신고: 2024-서울강남-0000
            </p>
            <p>Copyright © VIBEFOLIO. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
             {/* 추가 인증 마크 등을 넣을 수 있음 */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
