"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { ShoppingBag, ShieldCheck, AlertCircle } from "lucide-react";

export default function PublicShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getOrders().then(setItems).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">الشحن</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">شحن وجميع حسابات Free Fire وببجي</p>
      </motion.div>

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
            <motion.div key={item.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard>
                <div className="aspect-video rounded-[14px] overflow-hidden mb-4 bg-[rgba(255,255,255,0.03)]">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <h3 className="font-bold">{item.name}</h3>
                {item.description && <p className="text-sm text-[#9CA3AF] mt-1">{item.description}</p>}
                {item.price && <p className="text-lg font-black text-[#FFD700] mt-2">{item.price} {item.currency || "ليرة"}</p>}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
