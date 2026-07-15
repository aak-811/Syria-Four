"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import { Search, Users, X } from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

function SkeletonCard() {
  return (
    <GlassCard className="p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-28 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="h-3 w-16 rounded bg-[rgba(255,255,255,0.06)]" />
        </div>
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

  const fallbackMembers = [
    { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, country: "SY", wins: 150, image: "" },
    { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, country: "SY", wins: 120, image: "" },
    { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, country: "SY", wins: 200, image: "" },
    { id: "4", name: "Elite1", gameId: "Elite-001", role: "elite", level: 70, country: "SY", wins: 95, image: "" },
    { id: "5", name: "Player1", gameId: "P1-002", role: "member", level: 60, country: "SY", wins: 50, image: "" },
    { id: "6", name: "Player2", gameId: "P2-003", role: "member", level: 55, country: "SY", wins: 40, image: "" },
  ];

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                className={`px-4 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 ${roleFilter === r ? "bg-[#E50914] text-white" : "glass text-[#9CA3AF] hover:text-white"}`}
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
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard hover onClick={() => setSelected(m)}>
                <div className="flex items-center gap-4">
                  <Avatar src={m.image || ""} size="xl" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">{m.name}</h3>
                    <p className="text-xs text-[#6B7280]">{m.gameId}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {m.role && <Badge variant={roleColors[m.role] || "default"} size="sm">{m.role}</Badge>}
                      {m.country && <Badge variant="default" size="sm">{m.country}</Badge>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black">{m.level || "—"}</p>
                    <p className="text-[10px] text-[#6B7280]">مستوى</p>
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
            <Avatar src={selected.image || ""} size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-bold">{selected.name}</h2>
            <p className="text-sm text-[#9CA3AF]">{selected.gameId}</p>
            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              {selected.role && <Badge variant={roleColors[selected.role] || "default"}>{selected.role}</Badge>}
              {selected.country && <Badge variant="default">{selected.country}</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[{ label: "المستوى", value: selected.level }, { label: "الرتبة", value: selected.rank || "—" }, { label: "فوز", value: selected.wins || 0 }, { label: "البلد", value: selected.country || "—" }, { label: "العمر", value: selected.age ?? "—" }, { label: "السلاح", value: selected.weapon || "—" }, { label: "تاريخ الانضمام", value: selected.joinDate ? new Date(selected.joinDate).toLocaleDateString() : "—" }, { label: "برايم", value: selected.prime ? `#${selected.prime}` : "—" }].map(f => (
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
