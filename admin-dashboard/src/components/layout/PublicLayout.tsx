"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816]">
      <Sidebar />
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[280px] bg-[#050816] border-l border-[rgba(255,255,255,0.06)] p-4 transition-transform duration-300">
            <button
              onClick={() => setMobileSidebar(false)}
              className="mb-4 w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
            >
              <span className="text-white text-lg">✕</span>
            </button>
          </div>
        </div>
      )}
      <Topbar onToggleSidebar={() => setMobileSidebar(true)} />
      <main className="pt-[70px] pb-24 lg:pb-8 px-4 md:px-8 lg:ml-0 transition-all duration-300"
        style={{ marginRight: "var(--sidebar-width, 260px)" }}
      >
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
