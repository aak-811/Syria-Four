"use client";

import { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Card from "@/components/ui/Card";
import { api } from "@/lib/api";
import { MessageCircle, Camera, Mail, Phone, Send, CheckCircle, Loader2 } from "lucide-react";

const contacts = [
  { icon: MessageCircle, label: "Discord", value: "SYRIA FOUR", href: "https://discord.gg/syriafour", color: "#5865F2" },
  { icon: Camera, label: "Instagram", value: "@syriafour", href: "https://instagram.com/syriafour", color: "#E4405F" },
  { icon: Mail, label: "البريد الإلكتروني", value: "support@syriafour.com", href: "mailto:support@syriafour.com", color: "var(--warning)" },
  { icon: Phone, label: "واتساب", value: "+963 XXX XXX XXX", href: "https://wa.me/963", color: "#25D366" },
];

export default function ContactPage() {
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
    } catch { /* silent */ }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PublicNavbar />
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black">اتصل بنا</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">للتواصل مع إدارة SYRIA FOUR</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="block">
                  <Card hover>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}22` }}>
                        <Icon size={22} style={{ color: c.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-dim)]">{c.label}</p>
                        <p className="font-semibold">{c.value}</p>
                      </div>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>

          <Card>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Send size={18} /> أرسل تذكرة دعم</h2>
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-[var(--success)] mb-4" />
                <p className="font-semibold">تم إرسال تذكرتك بنجاح!</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">سنقوم بالرد عليك في أقرب وقت ممكن.</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <input placeholder="اسمك" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors" />
                <input placeholder="بريدك الإلكتروني (اختياري)" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors" />
                <textarea placeholder="رسالتك..." rows={5} required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors resize-none" />
                <button type="submit" disabled={sending}
                  className="w-full py-3 rounded-[12px] bg-[var(--primary)] text-[var(--bg)] font-semibold text-sm hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >{sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} إرسال</button>
              </form>
            )}
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
