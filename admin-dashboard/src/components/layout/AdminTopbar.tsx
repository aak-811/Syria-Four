"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const [unseenCount, setUnseenCount] = useState(0);
  const lastCount = useRef(0);

  useEffect(() => {
    const check = () => {
      api.getNotifications().then(notifs => {
        const active = notifs.filter(n => n.active !== false).length;
        if (active > lastCount.current) setUnseenCount(active - lastCount.current);
        lastCount.current = active;
      }).catch(() => {});
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 lg:right-[260px] h-[70px] border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl z-20 flex items-center px-4 md:px-6 gap-4">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[10px] glass glass-hover"
      >
        <Menu size={20} />
      </button>
      <div className="flex-1" />
      <Link href="/admin/notifications" className="relative w-10 h-10 flex items-center justify-center rounded-[10px] glass glass-hover no-underline">
        <Bell size={18} className="text-[var(--text-muted)]" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--danger)] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unseenCount}
          </span>
        )}
      </Link>
    </div>
  );
}
