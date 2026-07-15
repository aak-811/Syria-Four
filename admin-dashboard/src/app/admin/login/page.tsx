"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) router.push("/admin");
    else setError("كلمة المرور خاطئة");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md glass rounded-[24px] p-8 space-y-6"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E50914] to-[#FF6B35] flex items-center justify-center mx-auto">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black">لوحة التحكم</h1>
          <p className="text-sm text-[#9CA3AF]">SYRIA FOUR - تسجيل الدخول</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3.5 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#E50914] transition-colors text-center text-lg tracking-wider"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-[#FF3B30] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 rounded-[14px] font-bold text-sm transition-all duration-300 disabled:opacity-50"
            style={{
              background: loading
                ? "linear-gradient(135deg, #E50914, #FF6B35)"
                : "linear-gradient(135deg, #E50914, #FF6B35)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                جاري التحقق...
              </span>
            ) : (
              "دخول"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-[#6B7280]">SYRIA FOUR &copy; 2026</p>
      </div>
    </div>
  );
}
