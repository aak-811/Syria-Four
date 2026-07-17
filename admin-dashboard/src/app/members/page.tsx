"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { api } from "@/lib/api";
import { Users, Search, Crown, Star, Shield, Swords, Medal, Camera, Phone, Calendar, Gamepad2 } from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

const roleLabels: Record<string, string> = {
  leader: "قائد", chief: "زعيم", vice: "نائب", elite: "نخبة", member: "عضو",
};

const fallback = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, wins: 150, tournaments: 25, country: "SY", goldFrame: true, vipBadge: true, nameColor: "#FFD700", profileColor: "#1a1a2e" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, wins: 120, tournaments: 18, country: "SY", goldFrame: true, vipBadge: true, nameColor: "#00E5FF", profileColor: "#0d1117" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, wins: 200, tournaments: 30, country: "SY", goldFrame: false, vipBadge: false, nameColor: "#8B5CF6", profileColor: "#0a0a1a" },
  { id: "4", name: "Elite1", gameId: "Elite-001", role: "elite", level: 70, wins: 95, tournaments: 12, country: "SY", goldFrame: false, vipBadge: false, nameColor: "#00E676", profileColor: "#0d1117" },
  { id: "5", name: "Player1", gameId: "P1-002", role: "member", level: 60, wins: 50, tournaments: 8, country: "SY" },
  { id: "6", name: "Player2", gameId: "P2-003", role: "member", level: 55, wins: 40, tournaments: 5, country: "SY" },
];

const roles = ["all", "leader", "chief", "vice", "elite", "member"];

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

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getMembers().then(data => setMembers(data?.length ? data : fallback))
      .catch(() => setMembers(fallback))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (!q || m.name?.toLowerCase().includes(q) || m.gameId?.toLowerCase().includes(q)) &&
      (roleFilter === "all" || m.role === roleFilter);
  });

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">الأعضاء</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">جميع أعضاء كلان SYRIA FOUR</p>
        </div>

        <GlassCard className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  placeholder="البحث بالاسم أو معرف اللعبة..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[12px] pr-10 pl-4 py-2.5 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {roles.map(r => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-4 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 ${roleFilter === r ? "bg-[#00E5FF] text-[#050816]" : "glass text-[#9CA3AF] hover:text-white"}`}
                >{r === "all" ? "الكل" : roleLabels[r] || r}</button>
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
            {filtered.map((m, i) => {
              const pc = m.profileColor || "";
              return (
                <div key={m.id} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className={`glass rounded-[18px] p-6 transition-all duration-300 hover:bg-[rgba(255,255,255,0.09)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] cursor-pointer relative overflow-hidden group text-center py-6 ${pc ? "" : "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] backdrop-blur-[20px]"}`} style={pc ? { background: `linear-gradient(135deg, ${pc} 0%, ${pc}dd 100%)`, backdropFilter: "blur(20px)" } : undefined} onClick={() => setSelected(m)}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Gold Frame */}
                    <div className={`relative inline-block ${m.goldFrame ? "rounded-full p-[3px] bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]" : ""}`}>
                      <Avatar src={m.image || ""} name={m.name} size="xl" className="ring-2 ring-[rgba(0,229,255,0.1)] ring-offset-2 ring-offset-[#050816] rounded-full" />
                      {/* VIP Badge */}
                      {m.vipBadge && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg shadow-[rgba(255,215,0,0.4)]">
                          <Crown size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-base mt-3" style={{ color: m.nameColor || "#FFFFFF" }}>{m.name}</h3>
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
                        >{roleLabels[m.role] || m.role}</span>
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
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
          {selected && (() => {
            const pc = selected.profileColor || "#050816";
            return (
              <div className="text-center">
                <div className={`relative inline-block ${selected.goldFrame ? "rounded-full p-[3px] bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)]" : ""}`}>
                  <Avatar src={selected.image || ""} name={selected.name} size="xl" className="ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-2 ring-offset-[#050816] rounded-full" />
                  {selected.vipBadge && (
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg shadow-[rgba(255,215,0,0.4)]">
                      <Crown size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold mt-3" style={{ color: selected.nameColor || "#FFFFFF" }}>{selected.name}</h2>
                <p className="text-sm text-[#9CA3AF]">{selected.gameId}</p>
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {selected.role && <Badge variant={roleColors[selected.role] || "default"}>{roleLabels[selected.role] || selected.role}</Badge>}
                  {selected.country && <Badge variant="default">{selected.country}</Badge>}
                  {selected.vipBadge && <Badge variant="gold">VIP</Badge>}
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
                {selected.playStyle && (
                  <div className="mt-4 glass rounded-[14px] p-3 text-right">
                    <p className="text-[10px] text-[#6B7280] mb-1">أسلوب اللعب</p>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Gamepad2 size={14} className="text-[#00E5FF]" /> {selected.playStyle}
                    </p>
                  </div>
                )}
                {selected.age && (
                  <div className="mt-2 glass rounded-[14px] p-3 text-right">
                    <p className="text-[10px] text-[#6B7280] mb-1">العمر</p>
                    <p className="text-sm font-semibold">{selected.age} سنة</p>
                  </div>
                )}
                {(selected.instagram || selected.phone) && (
                  <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                    {selected.instagram && (
                      <a href={`https://instagram.com/${selected.instagram}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-[10px] bg-gradient-to-l from-[#E1306C] to-[#833AB4] text-white no-underline hover:scale-105 transition-all"
                      >
                        <Camera size={12} /> @{selected.instagram}
                      </a>
                    )}
                    {selected.phone && (
                      <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-[10px] bg-[#25D366] text-white no-underline hover:scale-105 transition-all"
                      >
                        <Phone size={12} /> واتساب
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      </div>
    </PublicLayout>
  );
}
