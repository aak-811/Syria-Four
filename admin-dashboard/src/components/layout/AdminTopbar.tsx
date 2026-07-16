"use client";

import { Menu } from "lucide-react";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 lg:right-[260px] h-[70px] border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl z-20 flex items-center px-4 md:px-6 gap-4">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[10px] glass glass-hover"
      >
        <Menu size={20} />
      </button>
      <div className="flex-1" />
    </div>
  );
}
