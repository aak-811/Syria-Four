"use client";

import { useRef, useState, useEffect } from "react";
import { Bell, Menu, ChevronDown, Shield, X } from "lucide-react";
import Link from "next/link";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 h-[70px] z-30 bg-[rgba(5,8,22,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between h-full px-4 lg:px-8 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold hidden md:block">SYRIA FOUR</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 glass rounded-[14px] px-3 py-2 glass-hover cursor-pointer"
            >
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight">الموقع</p>
                <p className="text-[10px] text-[#9CA3AF]">SYRIA FOUR</p>
              </div>
              <ChevronDown size={14} className="text-[#6B7280]" />
            </div>

            {profileOpen && (
              <div className="absolute top-full left-0 mt-2 w-[200px] glass rounded-[14px] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden z-50">
                <Link href="/admin/login"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors no-underline"
                >
                  <Shield size={16} className="text-[#9CA3AF]" />
                  لوحة الإدارة
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
