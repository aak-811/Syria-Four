"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { api } from "@/lib/api";
import { Search, Users, Trophy, Swords } from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

const fallbackMembers = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, country: "SY", wins: 150, tournaments: 25, image: "" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, country: "SY", wins: 120, tournaments: 18, image: "" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, country: "SY", wins: 200, tournaments: 30, image: "" },
  { id: "4", name: "Elite1", gameId: "Elite-001", role: "elite", level: 70, country: "SY", wins: 95, tournaments: 12, image: "" },
  { id: "5", name: "Player1", gameId: "P1-002", role: "member", level: 60, country: "SY", wins: 50, tournaments: 8, image: "" },
  { id: "6", name: "Player2", gameId: "P2-003", role: "member", level: 55, country: "SY", wins: 40, tournaments: 5, image: "" },
];

function SkeletonCard() {
  return (
    <GlassCard className="p-6 animate-pulse text-center">
      <div className="w-20 h-20 rounded-full bg-[rgba(255,255,255,0.06)] mx-auto mb-4" />
      <div className="h-5 w-24 bg-[rgba(255,255,255,0.06)] mx-auto mb-2 rounded" />
      <div className="h-3 w-16 bg-[rgba(255,255,255,0.06)] mx-auto rounded" />
      <div className="flex justify-center gap-4 mt-4">
        <div className="h-8 w-16 bg-[rgba(255,255,255,0.06)] rounded" />
        <div className="h-8 w-16 bg-[rgba(255,255,255,0.06)] rounded" />
        <div className="h-8 w-16 bg-[rgba(255,255,255,0.06)] rounded" />
      </div>
    </GlassCard>
  );
}

export default function PublicMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getMembers().then(data => setMembers(data.length > 0 ? data : fallbackMembers)).catch(() => setMembers(fallbackMembers)).finally(() => setLoading(false));
  }, []);

  const roles = ["all", "leader", "chief", "vice", "elite", "member"];
  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (!q || m.name?.toLowerCase().includes(q) || m.gameId?.toLowerCase().includes(q)) &&
      (roleFilter === "all" || m.role === roleFilter);
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      >
        <h1 className="text-2xl font-black">الأعضاء</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">جميع أعضاء كلان SYRIA FOUR</p>
      </motion.div>

      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <Input placeholder="البحث بالاسم أو معرف اللعبة..." icon={<Search size={18} />} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {roles.map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 ${roleFilter === r ? "bg-[#00E5FF] text-[#050816]" : "glass text-[#9CA3AF] hover:text-white"}`}
              >{r === "all" ? "الكل" : r === "leader" ? "قائد" : r === "chief" ? "زعيم" : r === "vice" ? "نائب" : r === "elite" ? "نخبة" : "عضو"}</button>
            ))}
          </div>
        </div>
      </GlassCard>

      <p className="text-sm text-[#6B7280]">{loading ? "جارٍ التحميل..." : `${filtered.length} عضو`}</p>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <GlassCard className="p-12 text-center">
          <Users size={48} className="mx-auto text-[#6B7280] mb-4" />
          <p className="text-[#9CA3AF]">لا يوجد أعضاء</p>
        </GlassCard>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <GlassCard hover onClick={() => setSelected(m)} className="text-center py-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Avatar src={m.image || ""} size="xl" className="mx-auto mb-3 ring-2 ring-[rgba(0,229,255,0.1)] ring-offset-2 ring-offset-[#050816] rounded-full" />
                <h3 className="font-bold text-base">{m.name}</h3>
                <p className="text-xs text-[#6B7280] mb-2">{m.gameId}</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {m.role && (
                    <span className="text-[11px] px-3 py-1 rounded-full font-semibold"
                      style={{
                        backgroundColor: m.role === "leader" ? "rgba(0,229,255,0.12)" :
                          m.role === "chief" ? "rgba(255,215,0,0.12)" :
                            m.role === "vice" ? "rgba(139,92,246,0.12)" :
                              m.role === "elite" ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.06)",
                        color: m.role === "leader" ? "#00E5FF" :
                          m.role === "chief" ? "#FFD700" :
                            m.role === "vice" ? "#8B5CF6" :
                              m.role === "elite" ? "#00E676" : "#9CA3AF",
                      }}
                    >
                      {m.role === "leader" ? "قائد" : m.role === "vice" ? "نائب" : m.role === "chief" ? "زعيم" : m.role === "elite" ? "نخبة" : "عضو"}
                    </span>
                  )}
                  {m.country && (
                    <span className="text-[11px] px-3 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[#9CA3AF]">{m.country}</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-[#6B7280] border-t border-[rgba(255,255,255,0.06)] pt-3 mt-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#00E5FF] tabular-nums">
                      <AnimatedCounter to={m.tournaments || 0} duration={1} />
                    </p>
                    <p className="text-[10px]">بطولات</p>
                  </div>
                  <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#8B5CF6] tabular-nums">
                      <AnimatedCounter to={m.level || 0} duration={1} />
                    </p>
                    <p className="text-[10px]">مستوى</p>
                  </div>
                  <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#FFD700] tabular-nums">
                      <AnimatedCounter to={m.wins || 0} duration={1} />
                    </p>
                    <p className="text-[10px]">فوز</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="تفاصيل العضو">
        {selected && (
          <div className="text-center">
            <Avatar src={selected.image || ""} size="xl" className="mx-auto mb-4 ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-2 ring-offset-[#050816] rounded-full" />
            <h2 className="text-xl font-bold">{selected.name}</h2>
            <p className="text-sm text-[#9CA3AF]">{selected.gameId}</p>
            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              {selected.role && (
                <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: selected.role === "leader" ? "rgba(0,229,255,0.12)" :
                      selected.role === "chief" ? "rgba(255,215,0,0.12)" : "rgba(255,255,255,0.06)",
                    color: selected.role === "leader" ? "#00E5FF" :
                      selected.role === "chief" ? "#FFD700" : "#9CA3AF",
                  }}
                >{selected.role === "leader" ? "قائد" : selected.role === "vice" ? "نائب" : selected.role === "chief" ? "زعيم" : selected.role === "elite" ? "نخبة" : "عضو"}</span>
              )}
              {selected.country && <Badge variant="default">{selected.country}</Badge>}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "البطولات", value: selected.tournaments || 0, color: "#00E5FF" },
                { label: "المستوى", value: selected.level || "—", color: "#8B5CF6" },
                { label: "فوز", value: selected.wins || 0, color: "#FFD700" },
              ].map(f => (
                <div key={f.label} className="glass rounded-[14px] p-3">
                  <p className="text-lg font-bold" style={{ color: f.color }}>{f.value}</p>
                  <p className="text-[10px] text-[#6B7280]">{f.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { label: "الرتبة", value: selected.rank || "—" },
                { label: "البلد", value: selected.country || "—" },
                { label: "العمر", value: selected.age ?? "—" },
                { label: "السلاح", value: selected.weapon || "—" },
                { label: "تاريخ الانضمام", value: selected.joinDate ? new Date(selected.joinDate).toLocaleDateString() : "—" },
                { label: "برايم", value: selected.prime ? `#${selected.prime}` : "—" },
              ].map(f => (
                <div key={f.label} className="glass rounded-[14px] p-3">
                  <p className="text-[10px] text-[#6B7280]">{f.label}</p>
                  <p className="text-sm font-semibold mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
            {selected.bio && <p className="text-sm text-[#9CA3AF] mt-4">{selected.bio}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
