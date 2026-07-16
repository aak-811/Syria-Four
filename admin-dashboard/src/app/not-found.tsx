"use client";

import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PublicNavbar />
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="w-24 h-24 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
            <span className="text-white font-black text-4xl">404</span>
          </div>
          <h1 className="text-3xl font-black mb-2">الصفحة غير موجودة</h1>
          <p className="text-[var(--text-muted)] mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[var(--primary)] text-[var(--bg)] font-semibold hover:brightness-110 transition-all"
          >
            العودة للرئيسية
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
