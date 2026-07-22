"use client";

import Link from "next/link";
import { Shield, MessageCircle } from "lucide-react";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="fixed top-0 right-0 left-0 h-[70px] z-30 bg-[rgba(5,8,22,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between h-full px-4 lg:px-8 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <span className="text-sm font-bold hidden md:block">SYRIA FOUR</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/chat">
            <div className="flex items-center gap-2 glass rounded-[14px] px-4 py-2.5 glass-hover text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">الدردشة</span>
            </div>
          </Link>
          <Link href="/admin">
            <div className="flex items-center gap-2 glass rounded-[14px] px-4 py-2.5 glass-hover text-sm font-medium text-[#8B5CF6] hover:text-white transition-colors">
              <Shield size={16} />
              <span className="hidden sm:inline">لوحة التحكم</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
