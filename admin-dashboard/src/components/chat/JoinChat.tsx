"use client";

import { useState } from "react";
import { useChat } from "@/lib/chat-store";
import { MessageCircle, User, Shield, KeyRound, Loader2, AlertCircle, Hash } from "lucide-react";

export default function JoinChat() {
  const { join, joinError } = useChat();
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    setLoading(true);
    await join(name.trim(), gameId.trim(), password.trim());
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.2)]">
          <MessageCircle size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2 gradient-text">دردشة SYRIA FOUR</h1>
        <p className="text-[var(--text-muted)] mb-8">أدخل بياناتك للدخول إلى الدردشة العامة</p>

        <form onSubmit={handleJoin} className="space-y-3.5">
          <div className="relative">
            <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              placeholder="الاسم في الدردشة"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[14px] pr-12 pl-4 py-3.5 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
              autoFocus
            />
          </div>

          <div className="relative">
            <Hash size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              placeholder="الأيدي (اختياري)"
              value={gameId}
              onChange={e => setGameId(e.target.value)}
              maxLength={20}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[14px] pr-12 pl-4 py-3.5 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          <div className="relative">
            <KeyRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="password"
              placeholder="كلمة السر"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[14px] pr-12 pl-4 py-3.5 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          {joinError && (
            <div className="flex items-center gap-2 text-sm text-[var(--danger)] bg-[rgba(229,9,20,0.08)] rounded-[12px] px-4 py-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{joinError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !password.trim() || loading}
            className="w-full py-3.5 rounded-[14px] bg-gradient-to-l from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
            {loading ? "جاري التحقق..." : "دخول الدردشة"}
          </button>
        </form>

        <p className="mt-6 text-xs text-[var(--text-dim)]">
          كلمة السر مطلوبة للدخول إلى الدردشة العامة للكلان
        </p>
      </div>
    </div>
  );
}
