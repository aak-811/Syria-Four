"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { ShieldCheck, Diamond, Send, Loader2, CheckCircle, X, Zap, Star, Sparkles, Gem } from "lucide-react";

const ffDiamondPacks = [
  { id: "d1", name: "باقة 75", diamonds: 75, bonus: 5, popular: false, color: "#00E5FF", glow: "rgba(0,229,255,0.3)", bg: "rgba(0,229,255,0.08)" },
  { id: "d2", name: "باقة 150", diamonds: 150, bonus: 10, popular: true, color: "#8B5CF6", glow: "rgba(139,92,246,0.3)", bg: "rgba(139,92,246,0.08)" },
  { id: "d3", name: "باقة 380", diamonds: 380, bonus: 25, popular: false, color: "#FFD700", glow: "rgba(255,215,0,0.3)", bg: "rgba(255,215,0,0.08)" },
  { id: "d4", name: "باقة 770", diamonds: 770, bonus: 50, popular: false, color: "#FF6B35", glow: "rgba(255,107,53,0.3)", bg: "rgba(255,107,53,0.08)" },
  { id: "d5", name: "باقة 1550", diamonds: 1550, bonus: 100, popular: false, color: "#E1306C", glow: "rgba(225,48,108,0.3)", bg: "rgba(225,48,108,0.08)" },
  { id: "d6", name: "باقة 4300", diamonds: 4300, bonus: 300, popular: false, color: "#00E676", glow: "rgba(0,230,118,0.3)", bg: "rgba(0,230,118,0.08)" },
];

export default function ShopPage() {
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", gameId: "", phone: "", reason: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.gameId) return;
    setSending(true);
    try {
      await api.addOrder({ type: "diamond", pack: selectedPack?.name, ...form, status: "pending" });
      setSent(true);
    } catch {
    } finally {
      setSending(false);
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">الشحن والمتجر</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">شحن جواهر فري فاير</p>
        </div>

        <GlassCard className="p-4 flex items-start gap-3">
          <ShieldCheck size={20} className="text-[#00E676] shrink-0 mt-0.5" />
          <div className="text-sm text-[#9CA3AF]">
            <p className="font-semibold text-white">شحن آمن ومضمون</p>
            <p>للطلب اختر الباقة واملأ النموذج.</p>
          </div>
        </GlassCard>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gem size={20} className="text-[#00E5FF]" />
            <h2 className="text-lg font-bold">باقات شحن جواهر فري فاير</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {ffDiamondPacks.map((pack, i) => (
              <div key={pack.id} className="animate-fade-slide-up relative" style={{ animationDelay: `${i * 0.05}s` }}>
                {pack.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-full bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black text-[9px] font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
                    <Star size={8} /> الأكثر طلباً
                  </div>
                )}
                <GlassCard hover onClick={() => { setSelectedPack(pack); setShowForm(false); setSent(false); }}
                  className={`text-center py-5 cursor-pointer relative overflow-hidden group ${pack.popular ? "ring-1 ring-[rgba(255,215,0,0.3)]" : ""}`}
                  style={{ background: `linear-gradient(135deg, ${pack.bg}, rgba(255,255,255,0.02))` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 50%, ${pack.glow}, transparent 70%)` }} />
                  {pack.popular && (<div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${pack.color}, ${pack.color}88)` }} />)}
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" style={{ backgroundColor: `${pack.color}18`, boxShadow: `0 0 20px ${pack.glow}` }}>
                      <Diamond size={26} style={{ color: pack.color }} />
                    </div>
                    <h3 className="text-sm font-bold">{pack.name}</h3>
                    <p className="dir-ltr text-lg font-black mt-1 flex items-center justify-center gap-1" style={{ color: pack.color }}>
                      <Zap size={14} /> {pack.diamonds.toLocaleString()}
                    </p>
                    {pack.bonus > 0 && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${pack.color}18`, color: pack.color }}>
                        +{pack.bonus} هدية
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        <Modal open={!!selectedPack && !showForm} onClose={() => setSelectedPack(null)} title="" className="max-w-sm">
          {selectedPack && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${selectedPack.color}18`, boxShadow: `0 0 30px ${selectedPack.glow}` }}>
                <Diamond size={24} style={{ color: selectedPack.color }} />
              </div>
              <h2 className="text-lg font-bold">{selectedPack.name}</h2>
              <p className="text-2xl font-black flex items-center justify-center gap-2" style={{ color: selectedPack.color }}>
                <Zap size={18} /> {selectedPack.diamonds?.toLocaleString()}
              </p>
              {selectedPack.bonus > 0 && (
                <p className="text-sm" style={{ color: selectedPack.color }}>
                  <Star size={12} className="inline ml-1" />
                  +{selectedPack.bonus} هدية مجانية
                </p>
              )}
              <button onClick={() => { setShowForm(true); setSent(false); }}
                className="w-full py-3 rounded-[14px] text-white font-semibold text-sm hover:scale-[1.01] transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${selectedPack.color}, ${selectedPack.color}88)` }}
              ><Send size={16} /> طلب الشراء</button>
              <button onClick={() => setSelectedPack(null)}
                className="text-sm text-[#6B7280] hover:text-white transition-colors border-0 bg-transparent cursor-pointer">إلغاء</button>
            </div>
          )}
        </Modal>

        <Modal open={showForm} onClose={() => { setShowForm(false); setSent(false); }} title="" className="max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">طلب {selectedPack?.name}</h2>
              <button onClick={() => { setShowForm(false); setSent(false); }}
                className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors border-0 cursor-pointer"><X size={16} /></button>
            </div>
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-[#00E676] mb-4" />
                <p className="font-semibold">تم إرسال طلبك!</p>
                <p className="text-sm text-[#9CA3AF] mt-1">سيتم التواصل معك خلال 24 ساعة.</p>
              </div>
            ) : (
              <form onSubmit={handleOrder} className="space-y-4">
                <input placeholder="اسمك داخل اللعبة" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all" />
                <input placeholder="معرف اللعبة (UID)" value={form.gameId} onChange={e => setForm(p => ({ ...p, gameId: e.target.value }))} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all" />
                <input placeholder="رقم واتساب للتواصل" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all" />
                <textarea placeholder="سبب الطلب (اختياري)" rows={3} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all resize-none" />
                <button type="submit" disabled={sending}
                  className="w-full py-3 rounded-[14px] text-white font-semibold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${selectedPack?.color || "#00E5FF"}, ${selectedPack?.color ? selectedPack.color + "88" : "#8B5CF6"})` }}
                >{sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} تأكيد الطلب</button>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </PublicLayout>
  );
}
