"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Users, Swords, Trophy, Crown, Star, Shield, Medal, ArrowLeft, Sparkles, Target, Zap } from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

const fallbackLeaders = [
  { id: "1", name: "AAK", gameId: "AAK-1234", role: "leader", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AAK", wins: 150, level: 80, country: "SY" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai", wins: 120, level: 75, country: "SY" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Za3im", wins: 200, level: 85, country: "SY" },
];

const fallbackTournaments = [
  { id: "1", name: "بطولة SYRIA الموسمية", type: "current", description: "بطولة الموسم الحالي", startDate: "2026-07-01", maxPlayers: 100 },
  { id: "2", name: "كأس المحاربين", type: "upcoming", description: "بطولة المحاربين القادمة", startDate: "2026-08-15", maxPlayers: 64 },
  { id: "3", name: "بطولة الصيف", type: "previous", description: "بطولة الصيف الماضية", startDate: "2026-06-01", maxPlayers: 80 },
];

const fallbackGallery = [
  { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", label: "فريق SYRIA FOUR" },
  { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80", label: "بطولة" },
  { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80", label: "لحظة انتصار" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", label: "تدريبات" },
];

export default function PublicHomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => fallbackTournaments),
      api.getEvents().catch(() => []),
      api.getGallery().catch(() => fallbackGallery),
    ]).then(([m, t, e, g]) => {
      setMembers(m.length > 0 ? m : []);
      setTournaments(t.length > 0 ? t : fallbackTournaments);
      setEvents(e.length > 0 ? e : []);
      setGallery(g.length > 0 ? g : fallbackGallery);
    }).finally(() => setLoading(false));
  }, []);

  const totalWins = members.reduce((s, m) => s + (parseInt(m.wins) || 0), 0);
  const leaders = members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role));
  const displayLeaders = leaders.length > 0 ? leaders : fallbackLeaders;

  const stats = [
    { label: "الأعضاء", value: members.length || 47, icon: Users, color: "#E50914" },
    { label: "البطولات", value: tournaments.length || 12, icon: Swords, color: "#FFD700" },
    { label: "انتصارات", value: totalWins || 1250, icon: Trophy, color: "#00E676" },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#E50914] to-[#FF6B35] mx-auto mb-6 animate-pulse" />
          <div className="h-12 w-64 bg-[rgba(255,255,255,0.06)] rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-6 w-48 bg-[rgba(255,255,255,0.04)] rounded-xl mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(229,9,20,0.08)] to-transparent pointer-events-none" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-32 h-32 rounded-2xl mx-auto mb-6 shadow-[0_0_60px_rgba(229,9,20,0.4)] relative overflow-hidden"
        >
          <img src="/images/clan-logo.png" alt="SYRIA FOUR" className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-[#E50914]', 'to-[#FF6B35]');
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-4xl tracking-tighter">S4</span>';
            }}
          />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
            <Sparkles size={14} className="text-black" />
          </div>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-l from-[#E50914] via-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">
          SYRIA FOUR
        </h1>
        <p className="text-[#9CA3AF] text-lg md:text-xl">كلان فري فاير - القمة تبدأ من هنا</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="text-center py-6 group">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${s.color}22` }}
              >
                <s.icon size={28} style={{ color: s.color }} />
              </div>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-sm text-[#9CA3AF] mt-1">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* About Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-[rgba(229,9,20,0.12)] flex items-center justify-center shrink-0">
              <Target size={24} className="text-[#E50914]" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">من نحن</h2>
              <p className="text-[#9CA3AF] leading-relaxed">
                SYRIA FOUR هو كلان فري فاير سوري يضم نخبة من اللاعبين المحترفين. 
                نشارك في البطولات المحلية والعالمية، ونسعى دائمًا لتحقيق الانتصارات 
                ورفع اسم سوريا عاليًا في عالم الألعاب الإلكترونية.
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1"><Zap size={14} className="text-[#FFD700]" /> تأسس 2020</span>
                <span className="flex items-center gap-1"><Users size={14} className="text-[#00E676]" /> {stats[0].value}+ عضو</span>
                <span className="flex items-center gap-1"><Trophy size={14} className="text-[#E50914]" /> {stats[1].value} بطولة</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Leaders Section */}
      {displayLeaders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Crown size={22} className="text-[#FFD700]" /> القيادات
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayLeaders.slice(0, 6).map((l, i) => (
              <motion.div key={l.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="text-center py-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E50914] via-[#FFD700] to-[#00E676] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Avatar src={l.image || ""} size="xl" className="mx-auto mb-3" />
                  <h3 className="font-bold">{l.name}</h3>
                  <p className="text-xs text-[#6B7280]">{l.gameId}</p>
                  <Badge variant={roleColors[l.role] || "default"} size="sm" className="mt-2">
                    {l.role === "leader" ? "قائد" : l.role === "vice" ? "شريك قائد" : l.role === "chief" ? "زعيم" : l.role}
                  </Badge>
                  {l.wins && <p className="text-xs text-[#6B7280] mt-2">{l.wins} فوز</p>}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-[#E50914]" /> رؤيتنا</h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              نطمح أن نكون أفضل كلان فري فاير في سوريا والمنطقة العربية، 
              من خلال التدريب المستمر والمشاركة في البطولات الكبرى.
            </p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Star size={18} className="text-[#FFD700]" /> قيمنا</h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              الانضباط، الاحترام، والعمل الجماعي هم أساس نجاحنا. 
              نؤمن بأن الفريق القوي يبني أفرادًا أقوياء.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Tournaments */}
      {tournaments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Swords size={22} className="text-[#FFD700]" /> البطولات
          </h2>
          <div className="grid gap-3">
            {tournaments.slice(0, 4).map((t, i) => (
              <motion.div key={t.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard hover>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[rgba(229,9,20,0.12)] flex items-center justify-center shrink-0">
                      <Medal size={22} className="text-[#E50914]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold">{t.name}</h3>
                      {t.description && <p className="text-xs text-[#9CA3AF] truncate">{t.description}</p>}
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
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Medal size={22} className="text-[#E50914]" /> المعرض
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="rounded-[14px] overflow-hidden aspect-square group cursor-pointer"
              >
                <img src={img.src} alt={img.label || ""} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
