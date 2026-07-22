"use client";

import { useState } from "react";
import { useChat } from "@/lib/chat-store";
import { MessageCircle, User } from "lucide-react";

export default function JoinChat() {
  const { join, conversations } = useChat();
  const [name, setName] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) join(name.trim());
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.2)]">
          <MessageCircle size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2 gradient-text">دردشة SYRIA FOUR</h1>
        <p className="text-[var(--text-muted)] mb-8">أدخل اسمك لبدء الدردشة مع الأعضاء</p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              placeholder="اسمك في الدردشة"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[14px] pr-12 pl-4 py-3.5 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-[14px] bg-gradient-to-l from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40"
          >
            دخول الدردشة
          </button>
        </form>

        {conversations.length > 0 && (
          <p className="mt-6 text-xs text-[var(--text-dim)]">
            {conversations.length} محادثة نشطة
          </p>
        )}
      </div>
    </div>
  );
}
