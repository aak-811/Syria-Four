"use client";
import { useState, useEffect } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { ShoppingBag, ShieldCheck } from "lucide-react";

export default function PublicShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fallbackItems = [
    { id: "1", name: "باقة 100 ديموند", description: "شحن 100 ديموند فري فاير", price: "5000", currency: "ل.س", image: "" },
    { id: "2", name: "باقة 500 ديموند", description: "شحن 500 ديموند فري فاير", price: "20000", currency: "ل.س", image: "" },
    { id: "3", name: "باقة 1000 ديموند", description: "شحن 1000 ديموند فري فاير", price: "35000", currency: "ل.س", image: "" },
    { id: "4", name: "حساب مميز", description: "حساب فري فاير مميز كامل", price: "50000", currency: "ل.س", image: "" },
    { id: "5", name: "بطاقة موسم", description: "بطاقة الموسم الحالي", price: "15000", currency: "ل.س", image: "" },
    { id: "6", name: "عضوية VIP", description: "عضوية VIP في الكلان", price: "25000", currency: "ل.س", image: "" },
  ];

  useEffect(() => {
    api.getOrders().then(data => setItems(data.length > 0 ? data : fallbackItems)).catch(() => setItems(fallbackItems)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="fade-in">
        <h1 className="text-2xl font-black">الشحن</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">شحن وجميع حسابات Free Fire وببجي</p>
      </div>

      <GlassCard className="p-4 flex items-start gap-3">
        <ShieldCheck size={20} className="text-[#00E676] shrink-0 mt-0.5" />
        <div className="text-sm text-[#9CA3AF]">
          <p className="font-semibold text-white">شحن آمن ومضمون</p>
          <p>جميع عمليات الشحن تتم بسرعة وأمان. للطلب يرجى التواصل مع الإدارة.</p>
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => (
          <GlassCard key={i} className="animate-pulse p-6"><div /></GlassCard>
        ))}</div>
      ) : items.length === 0 ? (
        <GlassCard className="p-12 text-center"><ShoppingBag size={48} className="mx-auto text-[#6B7280] mb-4" /><p className="text-[#9CA3AF]">لا توجد منتجات متاحة حاليًا</p></GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={item.id || i} className="fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <GlassCard>
                <div className="aspect-video rounded-[14px] overflow-hidden mb-4 bg-[rgba(255,255,255,0.03)]">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <h3 className="font-bold">{item.name}</h3>
                {item.description && <p className="text-sm text-[#9CA3AF] mt-1">{item.description}</p>}
                {item.price && <p className="text-lg font-black text-[#FFD700] mt-2">{item.price} {item.currency || "ليرة"}</p>}
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
