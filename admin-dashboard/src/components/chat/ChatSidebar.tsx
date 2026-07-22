"use client";

import { useChat } from "@/lib/chat-store";
import { MessageCircle, Users, LogOut, ChevronDown } from "lucide-react";

export default function ChatSidebar() {
  const { userName, userAvatar, userGameId, presence, userId, leave } = useChat();
  const onlineCount = Object.values(presence).filter(p => p.status === "online").length;

  return (
    <div className="w-full lg:w-[280px] border-l border-[var(--border)] flex flex-col bg-[var(--bg)] shrink-0">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-[var(--primary)]" />
            <h2 className="font-bold text-sm">الدردشة</h2>
          </div>
          <button onClick={leave} className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors" title="خروج">
            <LogOut size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 p-2 rounded-[10px] bg-[var(--surface)]">
          {userAvatar ? <img src={userAvatar} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-xs font-bold text-white">{(userName || "?").charAt(0)}</div>}
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{userName}</p>
            {userGameId && <p className="text-[9px] text-[var(--text-dim)]">ID: {userGameId}</p>}
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-gradient-to-r from-[rgba(0,229,255,0.08)] to-[rgba(139,92,246,0.05)] border border-[rgba(0,229,255,0.12)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center shrink-0">
            <Users size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold">SYRIA FOUR</p>
            <p className="text-[10px] text-[var(--text-muted)]">الدردشة العامة للكلان</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider">المتواجدون</p>
          <span className="text-[10px] text-[var(--success)]">{onlineCount} متصل</span>
        </div>
        {Object.entries(presence).map(([uid, p]) => {
          const isOnline = p.status === "online";
          return (
            <div key={uid} className="flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] hover:bg-[var(--surface)] transition-colors">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[9px] font-bold text-white">{(p.username || "?").charAt(0)}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg)] ${isOnline ? "bg-[var(--success)]" : "bg-[var(--text-dim)]"}`} />
              </div>
              <span className="text-xs font-medium truncate">{p.username}</span>
              {uid === userId && <span className="text-[9px] text-[var(--text-dim)]">(أنت)</span>}
            </div>
          );
        })}
        {Object.keys(presence).length === 0 && (
          <p className="text-[10px] text-[var(--text-dim)] text-center py-4">لا يوجد متصلون</p>
        )}
      </div>
    </div>
  );
}
