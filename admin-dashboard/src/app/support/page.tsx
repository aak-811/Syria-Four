"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Send, CheckCircle, Loader2, Camera, Phone, ChevronLeft, MessageCircle } from "lucide-react";

const contacts = [
  {
    title: "شريك القائد",
    name: "ABU AMİR",
    instagram: "aak.811",
    instagramUrl: "https://www.instagram.com/aak.811?igsh=MTVtNG94MTFhdGdrMA%3D%3D&utm_source=qr",
    phone: "+31 6 87747281",
    phoneUrl: "https://wa.me/31687747281",
    color: "#FFD700",
  },
  {
    title: "قائد الكلان",
    name: "QUSAİ",
    instagram: "qusai7r",
    instagramUrl: "https://www.instagram.com/qusai7r?igsh=dDUzcTk0bG9xeTBh",
    phone: "+31 6 87975558",
    phoneUrl: "https://wa.me/31687975558",
    color: "#00E5FF",
  },
];

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", gameId: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSending(true);
    try {
      await api.addSupportRequest(form);
      setSent(true);
      setForm({ name: "", gameId: "", message: "" });
    } catch {
    } finally {
      setSending(false);
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">الدعم الفني</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">للتواصل مع إدارة SYRIA FOUR</p>
        </div>

        {/* Social Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((c, i) => (
            <div key={i} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <GlassCard className="relative overflow-hidden group">
                <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: `${c.color}08`, filter: "blur(40px)" }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: `${c.color}15` }}>
                      <span className="text-lg font-black" style={{ color: c.color }}>{c.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B7280]">{c.title}</p>
                      <p className="font-bold text-sm">{c.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-gradient-to-l from-[#E1306C] to-[#833AB4] text-white text-[11px] font-semibold hover:scale-105 transition-all no-underline"
                    ><Camera size={12} /> @{c.instagram}</a>
                    {c.phone && (
                      <a href={c.phoneUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#25D366] text-white text-[11px] font-semibold hover:scale-105 transition-all no-underline"
                      ><Phone size={12} /> واتساب</a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Support Ticket Form */}
        <GlassCard className="p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Send size={18} /> أرسل تذكرة دعم</h2>
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-[#00E676] mb-4" />
              <p className="font-semibold">تم إرسال تذكرتك بنجاح!</p>
              <p className="text-sm text-[#9CA3AF] mt-1">سنقوم بالرد عليك في أقرب وقت ممكن.</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <input placeholder="الاسم" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all duration-300" />
              <input placeholder="الأيدي (اختياري)" value={form.gameId} onChange={e => setForm(p => ({ ...p, gameId: e.target.value }))}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all duration-300" />
              <textarea placeholder="رسالتك..." rows={5} required
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all duration-300 resize-none"
                value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-[14px] bg-[#E50914] text-white font-semibold text-sm hover:bg-[#f5101a] transition-all duration-300 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
              >{sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} إرسال</button>
            </form>
          )}
        </GlassCard>
      </div>
    </PublicLayout>
  );
}
