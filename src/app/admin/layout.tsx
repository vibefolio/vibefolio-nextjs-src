import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";

export const metadata: Metadata = {
  title: "관리자 대시보드 | Vibefolio",
  description: "Vibefolio 관리자 전용 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminGuard>{children}</AdminGuard>
    </div>
  );
}
