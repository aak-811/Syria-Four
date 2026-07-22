"use client";

import { useState, useMemo } from "react";
import { useChat } from "@/lib/chat-store";
import { Search, Plus, MessageCircle, Users, LogOut, Hash } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ChatSidebar() {
  const { conversations, messages, activeConv, setActiveConv, userId, userName, presence, leave, unreadCount } = useChat();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "private" | "group">("all");

  const filtered = useMemo(() => {
    return conversations
      .filter(c => tab === "all" || c.type === tab)
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.lastMessageAt || b.created_at || "").getTime() - new Date(a.lastMessageAt || a.created_at || "").getTime());
  }, [conversations, tab, search]);

  const getLastMsg = (convId: string) => {
    const msgs = messages[convId];
    return msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
  };

  return (
    <div className="w-full lg:w-[320px] border-l border-[var(--border)] flex flex-col bg-[var(--bg)] shrink-0">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-[var(--primary)]" />
            <h2 className="font-bold">الدردشة</h2>
            {unreadCount > 0 && (
              <span className="bg-[var(--primary)] text-[var(--bg)] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            <span className="text-[10px] text-[var(--text-muted)]">{userName}</span>
            <button onClick={leave} className="mr-2 p-1 rounded-lg hover:bg-[var(--surface)] text-[var(--text-dim)]" title="خروج">
              <LogOut size={14} />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[10px] pr-9 pl-3 py-2 text-xs text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div className="flex gap-1 mt-3">
          <button onClick={() => setTab("all")} className={`flex-1 py-1.5 rounded-[8px] text-[11px] font-medium transition-colors ${tab === "all" ? "bg-[var(--primary)] text-[var(--bg)]" : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"}`}>الكل</button>
          <button onClick={() => setTab("private")} className={`flex-1 py-1.5 rounded-[8px] text-[11px] font-medium transition-colors ${tab === "private" ? "bg-[var(--primary)] text-[var(--bg)]" : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"}`}>خاص</button>
          <button onClick={() => setTab("group")} className={`flex-1 py-1.5 rounded-[8px] text-[11px] font-medium transition-colors ${tab === "group" ? "bg-[var(--primary)] text-[var(--bg)]" : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"}`}>مجموعات</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-dim)] text-sm">لا توجد محادثات</div>
        ) : filtered.map(conv => {
          const last = getLastMsg(conv.id);
          const isUnread = last && last.senderId !== userId && messages[conv.id]?.length > 0;
          return (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full text-right px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors flex items-start gap-3 ${activeConv === conv.id ? "bg-[var(--surface)]" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${conv.type === "group" ? "bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)]" : "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"}`}>
                {conv.type === "group" ? <Users size={16} className="text-white" /> : <Hash size={16} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate">{conv.name}</span>
                  {conv.lastMessageAt && <span className="text-[10px] text-[var(--text-dim)] shrink-0">{formatDate(conv.lastMessageAt)}</span>}
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                  {last ? (
                    <>{last.senderName !== userName && <span className="font-medium">{last.senderName}: </span>}{last.type === "text" ? last.content : last.type === "image" ? "🖼️ صورة" : last.type === "voice" ? "🎤 رسالة صوتية" : last.type === "file" ? "📎 ملف" : "📎 مرفق"}</>
                  ) : "لا توجد رسائل"}
                </p>
              </div>
              {isUnread && <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0 mt-2" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
