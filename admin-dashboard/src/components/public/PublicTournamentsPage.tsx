"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { Swords, Calendar, Users, X } from "lucide-react";

const typeBadge: Record<string, "info" | "success" | "gold"> = { previous: "info", current: "success", upcoming: "gold" };
const typeNames: Record<string, string> = { previous: "سابقة", current: "حالية", upcoming: "قادمة" };

export default function PublicTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getTournaments().then(setTournaments).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tab === "all" ? tournaments : tournaments.filter(t => t.type === tab);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">البطولات</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">جميع بطولات SYRIA FOUR</p>
      </motion.div>

      <div className="flex items-center gap-2 flex-wrap">
        {["all", "previous", "current", "upcoming"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300 ${tab === t ? "bg-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.3)]" : "glass text-[#9CA3AF] hover:text-white"}`}
          >{t === "all" ? "الكل" : typeNames[t]}</button>
        ))}
      </div>

      {loading && (
        <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => (
          <GlassCard key={i} className="animate-pulse p-6"><div className="h-6 w-48 rounded bg-[rgba(255,255,255,0.06)]" /></GlassCard>
        ))}</div>
      )}

      {!loading && filtered.length === 0 && (
        <GlassCard className="p-12 text-center"><Swords size={48} className="mx-auto text-[#6B7280] mb-4" /><p className="text-[#9CA3AF]">لا توجد بطولات</p></GlassCard>
      )}

      {!loading && (
        <div className="grid gap-4">
          {filtered.map((t, i) => (
            <motion.div key={t.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard hover onClick={() => setSelected(t)}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-[14px] bg-[rgba(229,9,20,0.12)] flex items-center justify-center shrink-0">
                      <Swords size={22} className="text-[#E50914]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base">{t.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={typeBadge[t.type] || "default"} size="sm">{typeNames[t.type] || t.type}</Badge>
                        {t.mode && <span className="text-[11px] text-[#6B7280]">{t.mode}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    {t.startDate && <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(t.startDate).toLocaleDateString()}</span>}
                    {t.maxPlayers && <span className="flex items-center gap-1"><Users size={14} /> {t.maxPlayers}</span>}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""} className="max-w-lg">
        {selected && (
          <div className="space-y-4">
            <Badge variant={typeBadge[selected.type] || "default"}>{typeNames[selected.type] || selected.type}</Badge>
            {selected.description && <p className="text-sm text-[#9CA3AF]">{selected.description}</p>}
            <div className="grid grid-cols-2 gap-3">
              {[{ label: "تاريخ البداية", value: selected.startDate }, { label: "تاريخ النهاية", value: selected.endDate }, { label: "الوضع", value: selected.mode }, { label: "نوع الخريطة", value: selected.mapType }, { label: "أقصى عدد", value: selected.maxPlayers }, { label: "نوع الجائزة", value: selected.prizeType }, { label: "قيمة الجائزة", value: selected.prizeValue }, { label: "الذهب", value: selected.gold }, { label: "الفضة", value: selected.silver }].map(f => (
                f.value ? <div key={f.label} className="glass rounded-[14px] p-3"><p className="text-[10px] text-[#6B7280]">{f.label}</p><p className="text-sm font-semibold">{f.value}</p></div> : null
              ))}
            </div>
            {selected.participants?.length > 0 && (
              <div><p className="text-sm font-semibold mb-2">المشاركون ({selected.participants.length})</p>
                <div className="flex flex-wrap gap-2">{selected.participants.map((p: any, i: number) => (
                  <span key={i} className="glass rounded-[10px] px-3 py-1 text-xs">{p.name || p}</span>
                ))}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
