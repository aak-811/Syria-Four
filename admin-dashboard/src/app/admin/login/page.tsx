"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.replace("/admin");
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    const ok = await login(password);
    if (ok) router.replace("/admin");
    else setError("كلمة المرور خاطئة");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black">لوحة التحكم</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">يرجى إدخال كلمة المرور</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors text-center"
          />
          {error && <p className="text-sm text-[var(--danger)] text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-[14px] bg-[var(--primary)] text-[var(--bg)] font-semibold text-sm hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
