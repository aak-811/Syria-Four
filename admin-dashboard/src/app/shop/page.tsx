"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { ShoppingBag, ShieldCheck, Diamond, Send, Loader2, CheckCircle, X, Star, Zap } from "lucide-react";

const ffDiamondPacks = [
  { id: "d1", name: "70 + 5 ديموند", diamonds: 75, price: "5000", currency: "ل.س", bonus: 5, popular: false, image: "/images/diamond-70.png" },
  { id: "d2", name: "140 + 10 ديموند", diamonds: 150, price: "9000", currency: "ل.س", bonus: 10, popular: true, image: "/images/diamond-140.png" },
  { id: "d3", name: "355 + 25 ديموند", diamonds: 380, price: "20000", currency: "ل.س", bonus: 25, popular: false, image: "/images/diamond-355.png" },
  { id: "d4", name: "720 + 50 ديموند", diamonds: 770, price: "35000", currency: "ل.س", bonus: 50, popular: false, image: "/images/diamond-720.png" },
  { id: "d5", name: "1450 + 100 ديموند", diamonds: 1550, price: "65000", currency: "ل.س", bonus: 100, popular: false, image: "/images/diamond-1450.png" },
  { id: "d6", name: "4000 + 300 ديموند", diamonds: 4300, price: "150000", currency: "ل.س", bonus: 300, popular: false, image: "/images/diamond-4000.png" },
];

const otherItems = [
  { id: "o1", name: "بطاقة موسم", description: "بطاقة الموسم الحالي", price: "15000", currency: "ل.س" },
  { id: "o2", name: "عضوية VIP", description: "عضوية VIP في الكلان", price: "25000", currency: "ل.س" },
  { id: "o3", name: "حساب مميز", description: "حساب فري فاير مميز كامل", price: "50000", currency: "ل.س" },
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
      await api.addOrder({
        type: "diamond",
        pack: selectedPack?.name,
        ...form,
        status: "pending",
      });
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
          <p className="text-[#9CA3AF] text-sm mt-1">شحن جواهر فري فاير وحسابات وبطاقات</p>
        </div>

        <GlassCard className="p-4 flex items-start gap-3">
          <ShieldCheck size={20} className="text-[#00E676] shrink-0 mt-0.5" />
          <div className="text-sm text-[#9CA3AF]">
            <p className="font-semibold text-white">شحن آمن ومضمون</p>
            <p>جميع عمليات الشحن تتم بسرعة وأمان. للطلب يرجى تعبئة النموذج.</p>
          </div>
        </GlassCard>

        {/* Free Fire Diamond Packs */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Diamond size={20} className="text-[#00E5FF]" />
            <h2 className="text-lg font-bold">شحن جواهر فري فاير</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ffDiamondPacks.map((pack, i) => (
              <div key={pack.id} className="animate-fade-slide-up relative" style={{ animationDelay: `${i * 0.05}s` }}>
                {pack.popular && (
                  <div className="absolute -top-2.5 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black text-[10px] font-bold flex items-center gap-1 shadow-lg">
                    <Star size={10} /> الأكثر طلباً
                  </div>
                )}
                <GlassCard hover onClick={() => { setSelectedPack(pack); setShowForm(false); setSent(false); }} className={`text-center py-6 cursor-pointer relative overflow-hidden group ${pack.popular ? "ring-1 ring-[rgba(255,215,0,0.3)]" : ""}`}>
                  {pack.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] to-[#FF6B35]" />
                  )}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300 group-hover:scale-110">
                    <div className="text-center">
                      <Diamond size={28} className="text-white" />
                      {pack.bonus > 0 && (
                        <span className="block text-[8px] text-[#FFD700] font-bold mt-0.5">+{pack.bonus}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold">{pack.name}</h3>
                  <p className="text-2xl font-black text-[#00E5FF] mt-1">{pack.price}</p>
                  <p className="text-xs text-[#6B7280]">{pack.currency}</p>
                  {pack.bonus > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(255,215,0,0.1)] text-[11px] text-[#FFD700]">
                      <Zap size={10} /> هدية {pack.bonus} ديموند
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
                <GlassCard hover onClick={() => { setSelectedPack(item); setShowForm(false); setSent(false); }} className="text-center py-6 cursor-pointer">
                  <h3 className="font-bold">{item.name}</h3>
                  {item.description && <p className="text-sm text-[#9CA3AF] mt-1">{item.description}</p>}
                  <p className="text-lg font-black text-[#FFD700] mt-2">{item.price} {item.currency}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Order Form Modal */}
        <Modal open={!!selectedPack && !showForm} onClose={() => setSelectedPack(null)} title="" className="max-w-lg">
          {selectedPack && (
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                <Diamond size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">{selectedPack.name}</h2>
              <p className="text-3xl font-black text-[#00E5FF]">{selectedPack.price} {selectedPack.currency}</p>
              <button onClick={() => { setShowForm(true); setSent(false); }}
                className="w-full py-3 rounded-[14px] bg-gradient-to-l from-[#00E5FF] to-[#8B5CF6] text-white font-semibold text-sm hover:scale-[1.01] transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={16} /> طلب الشراء
              </button>
              <button onClick={() => setSelectedPack(null)}
                className="text-sm text-[#6B7280] hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
              >إلغاء</button>
            </div>
          )}
        </Modal>

        {/* Order Form */}
        <Modal open={showForm} onClose={() => { setShowForm(false); setSent(false); }} title="" className="max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">طلب {selectedPack?.name}</h2>
              <button onClick={() => { setShowForm(false); setSent(false); }}
                className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors border-0 cursor-pointer"
              ><X size={16} /></button>
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
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all"
                />
                <input placeholder="معرف اللعبة (UID)" value={form.gameId} onChange={e => setForm(p => ({ ...p, gameId: e.target.value }))} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all"
                />
                <input placeholder="رقم واتساب للتواصل" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all"
                />
                <textarea placeholder="سبب الطلب (اختياري)" rows={3} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all resize-none"
                />
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
