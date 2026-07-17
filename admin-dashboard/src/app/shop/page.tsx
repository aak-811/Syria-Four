"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { ShoppingBag, ShieldCheck, Diamond, Send, Loader2, CheckCircle, X, Star, Zap, Gem, Sparkles } from "lucide-react";

const ffDiamondPacks = [
  { id: "d1", name: "باقة 75", diamonds: 75, bonus: 5, popular: false, color: "#00E5FF" },
  { id: "d2", name: "باقة 150", diamonds: 150, bonus: 10, popular: true, color: "#8B5CF6" },
  { id: "d3", name: "باقة 380", diamonds: 380, bonus: 25, popular: false, color: "#FFD700" },
  { id: "d4", name: "باقة 770", diamonds: 770, bonus: 50, popular: false, color: "#FF6B35" },
  { id: "d5", name: "باقة 1550", diamonds: 1550, bonus: 100, popular: false, color: "#E1306C" },
  { id: "d6", name: "باقة 4300", diamonds: 4300, bonus: 300, popular: false, color: "#00E676" },
];

const otherItems = [
  { id: "o1", name: "بطاقة موسم", icon: "🎫" },
  { id: "o2", name: "عضوية VIP", icon: "👑" },
  { id: "o3", name: "حساب مميز", icon: "🎮" },
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

        {/* Free Fire Diamond Packs */}
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
                <GlassCard hover onClick={() => { setSelectedPack(pack); setShowForm(false); setSent(false); }} className={`text-center py-5 cursor-pointer relative overflow-hidden group ${pack.popular ? "ring-1 ring-[rgba(255,215,0,0.3)]" : ""}`}>
                  {pack.popular && (<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFD700] to-[#FF6B35]" />)}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${pack.color}18` }}>
                    <Diamond size={26} style={{ color: pack.color }} />
                  </div>
                  <h3 className="text-sm font-bold">{pack.name}</h3>
                  <p className="dir-ltr text-lg font-black mt-1" style={{ color: pack.color }}>
                    💎 {pack.diamonds.toLocaleString()}
                  </p>
                  {pack.bonus > 0 && (
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(255,215,0,0.1)] text-[10px] text-[#FFD700]">
                      <Zap size={9} /> +{pack.bonus} هدية
                    </div>
                  )}
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Other Items */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={20} className="text-[#FFD700]" />
            <h2 className="text-lg font-bold">منتجات أخرى</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherItems.map((item, i) => (
              <div key={item.id} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <GlassCard hover onClick={() => { setSelectedPack(item); setShowForm(false); setSent(false); }} className="text-center py-5 cursor-pointer group">
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <h3 className="font-bold text-sm">{item.name}</h3>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Order Modal */}
        <Modal open={!!selectedPack && !showForm} onClose={() => setSelectedPack(null)} title="" className="max-w-sm">
          {selectedPack && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${selectedPack.color || "#00E5FF"}18` }}>
                <Diamond size={24} style={{ color: selectedPack.color || "#00E5FF" }} />
              </div>
              <h2 className="text-lg font-bold">{selectedPack.name}</h2>
              <p className="text-2xl font-black" style={{ color: selectedPack.color || "#00E5FF" }}>💎 {selectedPack.diamonds?.toLocaleString() || selectedPack.name}</p>
              <button onClick={() => { setShowForm(true); setSent(false); }}
                className="w-full py-3 rounded-[14px] bg-gradient-to-l from-[#00E5FF] to-[#8B5CF6] text-white font-semibold text-sm hover:scale-[1.01] transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
              ><Send size={16} /> طلب الشراء</button>
              <button onClick={() => setSelectedPack(null)}
                className="text-sm text-[#6B7280] hover:text-white transition-colors border-0 bg-transparent cursor-pointer">إلغاء</button>
            </div>
          )}
        </Modal>

        {/* Order Form */}
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
                  className="w-full py-3 rounded-[14px] bg-gradient-to-l from-[#00E5FF] to-[#8B5CF6] text-white font-semibold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                >{sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} تأكيد الطلب</button>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </PublicLayout>
  );
}
