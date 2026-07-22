"use client";

import { useState } from "react";
import { useChat } from "@/lib/chat-store";
import { MessageCircle, User, KeyRound, Loader2, AlertCircle } from "lucide-react";

export default function JoinChat() {
  const { join, joinError } = useChat();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    setLoading(true);
    await join(name.trim(), password.trim());
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-5 bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.25)]">
            <MessageCircle size={34} className="text-white" />
          </div>
          <h1 className="text-2xl font-black">دردشة SYRIA FOUR</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">أدخل اسمك وكلمة السر للدخول</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-3">
          <div className="relative">
            <User size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input type="text" placeholder="الاسم" value={name} onChange={e => setName(e.target.value)} maxLength={30}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pr-11 pl-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors" autoFocus />
          </div>
          <div className="relative">
            <KeyRound size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pr-11 pl-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors" />
          </div>

          {joinError && (
            <div className="flex items-center gap-2 text-sm text-[#E50914] bg-[rgba(229,9,20,0.08)] rounded-xl px-4 py-2.5">
              <AlertCircle size={16} className="shrink-0" /> <span>{joinError}</span>
            </div>
          )}

          <button type="submit" disabled={!name.trim() || !password.trim() || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-l from-[#00E5FF] to-[#8B5CF6] text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={17} className="animate-spin" /> : null}
            {loading ? "جاري التحقق..." : "دخول الدردشة"}
          </button>
        </form>
      </div>
    </div>
  );
}
