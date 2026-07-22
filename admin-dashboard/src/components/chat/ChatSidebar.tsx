"use client";

import { useChat } from "@/lib/chat-store";
import { Users, LogOut, X } from "lucide-react";

export default function ChatSidebar({ onClose }: { onClose?: () => void }) {
  const { userName, userAvatar, presence, userId, onlineCount, leave } = useChat();

  return (
    <div className="w-[280px] h-full flex flex-col bg-[var(--bg)] border-l border-[var(--border)] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-[var(--primary)]" />
          <span className="font-bold text-sm">المتواجدون</span>
          <span className="text-[11px] text-[var(--success)] bg-[rgba(0,230,118,0.1)] px-1.5 py-0.5 rounded-full">{onlineCount}</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-[var(--surface)]"><X size={16} /></button>
      </div>

      {/* My Profile */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
        {userAvatar ? <img src={userAvatar} alt="" className="w-9 h-9 rounded-full" />
          : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-xs font-bold text-white">{(userName || "?").charAt(0)}</div>}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{userName}</p>
          <p className="text-[10px] text-[var(--success)]">متصل</p>
        </div>
        <button onClick={leave} className="p-1.5 rounded-lg hover:bg-[rgba(229,9,20,0.1)] text-[var(--text-dim)] hover:text-[#E50914] transition-colors" title="خروج">
          <LogOut size={16} />
        </button>
      </div>

      {/* Online Users */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
        {Object.entries(presence).map(([uid, p]) => {
          const isOnline = p.status === "online";
          const isMe = uid === userId;
          return (
            <div key={uid} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface)] transition-colors">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-xs font-bold text-white">{(p.username || "?").charAt(0)}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg)] ${isOnline ? "bg-[#00E676]" : "bg-[var(--text-dim)]"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.username} {isMe && <span className="text-[10px] text-[var(--text-muted)]">(أنت)</span>}</p>
                <p className={`text-[11px] ${isOnline ? "text-[#00E676]" : "text-[var(--text-dim)]"}`}>{isOnline ? "متصل" : "غير متصل"}</p>
              </div>
            </div>
          );
        })}
        {Object.keys(presence).length === 0 && (
          <p className="text-xs text-[var(--text-dim)] text-center py-8">لا يوجد متصلون</p>
        )}
      </div>
    </div>
  );
}
