"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { Users, Swords, Trophy, Crown, Star, Shield, Medal, ArrowLeft } from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

export default function PublicHomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => []),
      api.getEvents().catch(() => []),
      api.getGallery().catch(() => []),
    ]).then(([m, t, e, g]) => {
      setMembers(m);
      setTournaments(t);
      setEvents(e);
      setGallery(g);
    }).finally(() => setLoading(false));
  }, []);

  const totalWins = members.reduce((s, m) => s + (parseInt(m.wins) || 0), 0);

  const stats = [
    { label: "الأعضاء", value: members.length, icon: Users, color: "#E50914" },
    { label: "البطولات", value: tournaments.length, icon: Swords, color: "#FFD700" },
    { label: "انتصارات", value: totalWins, icon: Trophy, color: "#00E676" },
  ];

  const leaders = members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role));

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E50914] to-[#FF6B35] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(229,9,20,0.3)]">
          <span className="text-white font-black text-3xl">S4</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3">SYRIA FOUR</h1>
        <p className="text-[#9CA3AF] text-lg">كلان فري فاير - القمة تبدأ من هنا</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="text-center py-6">
              <s.icon size={32} className="mx-auto mb-3" style={{ color: s.color }} />
              <p className="text-3xl font-black">{loading ? "..." : s.value}</p>
              <p className="text-sm text-[#9CA3AF] mt-1">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Leaders Section */}
      {leaders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Crown size={22} className="text-[#FFD700]" /> القيادات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaders.slice(0, 6).map((l, i) => (
              <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="text-center py-6">
                  <Avatar src={l.image || ""} size="xl" className="mx-auto mb-3" />
                  <h3 className="font-bold">{l.name}</h3>
                  <Badge variant={roleColors[l.role] || "default"} size="sm">{l.role === "leader" ? "قائد" : l.role === "vice" ? "نائب" : "زعيم"}</Badge>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tournaments */}
      {tournaments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Swords size={22} className="text-[#FFD700]" /> البطولات</h2>
          <div className="grid gap-4">
            {tournaments.slice(0, 4).map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[rgba(229,9,20,0.12)] flex items-center justify-center">
                      <Medal size={22} className="text-[#E50914]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{t.name}</h3>
                      <p className="text-xs text-[#9CA3AF]">{t.description}</p>
                    </div>
                    <Badge variant={t.type === "upcoming" ? "gold" : t.type === "current" ? "success" : "info"} size="sm">
                      {t.type === "upcoming" ? "قادمة" : t.type === "current" ? "حالية" : "سابقة"}
                    </Badge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield size={22} className="text-[#E50914]" /> المعرض</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="rounded-[14px] overflow-hidden aspect-square"
              >
                <img src={img.src} alt={img.label || ""} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
