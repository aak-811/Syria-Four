"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { MessageCircle, Camera, Phone, Send, CheckCircle, Loader2, Headphones, ChevronLeft } from "lucide-react";

const contacts = [
  { icon: Camera, label: "قائد الكلان", value: "@aak.811", href: "https://instagram.com/aak.811", color: "#E1306C", desc: "AAK Khalid - مؤسس الكلان" },
  { icon: Camera, label: "شريك القائد", value: "@qusai7r", href: "https://instagram.com/qusai7r", color: "#FFD700", desc: "Qusai - شريك القائد" },
  { icon: Camera, label: "إدارة الدعم", value: "@Lorans_83", href: "https://instagram.com/Lorans_83", color: "#8B5CF6", desc: "Lorans - الدعم الفني" },
  { icon: Phone, label: "واتساب", value: "+963 934 946 251", href: "https://wa.me/963934946251", color: "#25D366", desc: "للتواصل المباشر" },
];

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSending(true);
    try {
      await api.addSupportRequest(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((c, i) => {
            const Icon = c.icon;
            return (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                className="animate-fade-slide-up no-underline" style={{ animationDelay: `${i * 0.07}s` }}
              >
                <GlassCard hover className="relative overflow-hidden group">
                  <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: `${c.color}08`, filter: "blur(40px)" }} />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${c.color}18` }}>
                      <Icon size={24} style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#6B7280]">{c.label}</p>
                      <p className="font-semibold">{c.value}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{c.desc}</p>
                    </div>
                    <ChevronLeft size={16} className="text-[#6B7280] group-hover:text-[#c] transition-colors" />
                  </div>
                </GlassCard>
              </a>
            );
          })}
        </div>

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
              <input placeholder="اسمك" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all duration-300"
              />
              <input placeholder="بريدك الإلكتروني أو إنستغرام (اختياري)" type="text" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all duration-300"
              />
              <textarea placeholder="رسالتك..." rows={5} required
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all duration-300 resize-none"
                value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              />
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-[14px] bg-[#E50914] text-white font-semibold text-sm hover:bg-[#f5101a] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 border-0 cursor-pointer"
              >{sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} إرسال</button>
            </form>
          )}
        </GlassCard>
      </div>
    </PublicLayout>
  );
}
