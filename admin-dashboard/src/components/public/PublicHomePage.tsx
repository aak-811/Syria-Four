"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { api } from "@/lib/api";
import {
  Users, Swords, Trophy, Eye, Crown, Medal,
  Target, Zap, Sparkles, Calendar, Gift, Users2,
  Image as ImageIcon, FileVideo, Bell, X,
  Clock
} from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

const fallbackLeaders = [
  { id: "1", name: "AAK", gameId: "AAK-1234", role: "leader", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AAK", wins: 150, level: 80, country: "SY" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai", wins: 120, level: 75, country: "SY" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Za3im", wins: 200, level: 85, country: "SY" },
];

const fallbackMembers = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, country: "SY", wins: 150, tournaments: 25, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AAK" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, country: "SY", wins: 120, tournaments: 18, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, country: "SY", wins: 200, tournaments: 30, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Za3im" },
  { id: "4", name: "Elite1", gameId: "Elite-001", role: "elite", level: 70, country: "SY", wins: 95, tournaments: 12, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elite1" },
  { id: "5", name: "Sniper", gameId: "Sniper-007", role: "member", level: 65, country: "SY", wins: 78, tournaments: 10, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper" },
  { id: "6", name: "Shadow", gameId: "Shadow-009", role: "member", level: 72, country: "SY", wins: 110, tournaments: 15, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow" },
];

const fallbackTournaments = [
  { id: "1", name: "بطولة SYRIA الموسمية", type: "current", description: "بطولة الموسم الحالي", startDate: "2026-07-01", endDate: "2026-08-01", mode: "5v5", maxPlayers: 100, prizeType: "ديموند", prizeValue: "5000", mapType: "بيرمودا", teamsCount: 16, logo: "", status: "جارية" },
  { id: "2", name: "كأس المحاربين", type: "upcoming", description: "بطولة المحاربين القادمة", startDate: "2026-08-15", endDate: "2026-09-15", mode: "4v4", maxPlayers: 64, prizeType: "عملة", prizeValue: "10000", mapType: "كالاهاري", teamsCount: 12, logo: "", status: "قادمة" },
  { id: "3", name: "بطولة الصيف", type: "previous", description: "بطولة الصيف الماضية", startDate: "2026-06-01", endDate: "2026-07-01", mode: "5v5", maxPlayers: 80, prizeType: "ديموند", prizeValue: "3000", mapType: "بيرمودا", teamsCount: 20, logo: "", status: "انتهت" },
];

const fallbackGallery = [
  { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", label: "فريق SYRIA FOUR" },
  { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80", label: "بطولة" },
  { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80", label: "لحظة انتصار" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", label: "تدريبات" },
];

const notificationsData = [
  { id: "1", text: "انضم عضو جديد إلى الكلان!", time: "منذ 5 دقائق", color: "#00E5FF" },
  { id: "2", text: "فوز جديد في البطولة!", time: "منذ 15 دقيقة", color: "#8B5CF6" },
  { id: "3", text: "تم تحديث ترتيب الأعضاء", time: "منذ ساعة", color: "#00E676" },
];

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-xs text-[#9CA3AF]">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedStatCard({ icon, value, label, suffix = "", delay = 0, color = "#00E5FF" }: {
  icon: React.ReactNode; value: number; label: string; suffix?: string; delay?: number; color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 rounded-[18px] bg-gradient-to-b from-[rgba(0,229,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <GlassCard className="text-center py-6 relative overflow-hidden">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <p className="text-3xl md:text-4xl font-black tabular-nums">
          <AnimatedCounter to={value} suffix={suffix} duration={2} />
        </p>
        <p className="text-sm text-[#9CA3AF] mt-1">{label}</p>
      </GlassCard>
    </motion.div>
  );
}

export default function PublicHomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState(notificationsData);
  const [dismissedNotifs, setDismissedNotifs] = useState<Set<string>>(new Set());

  console.log('[PUBLIC_HOME] RENDER: loading =', loading, 'members.length =', members.length, 'tournaments.length =', tournaments.length);

  useEffect(() => {
    console.log('[PUBLIC_HOME] useEffect START - calling APIs...');
    const p1 = api.getMembers().catch(err => { console.warn('[PUBLIC_HOME] getMembers failed:', err); return []; });
    const p2 = api.getTournaments().catch(err => { console.warn('[PUBLIC_HOME] getTournaments failed:', err); return fallbackTournaments; });
    const p3 = api.getEvents().catch(err => { console.warn('[PUBLIC_HOME] getEvents failed:', err); return []; });
    const p4 = api.getGallery().catch(err => { console.warn('[PUBLIC_HOME] getGallery failed:', err); return fallbackGallery; });
    Promise.all([p1, p2, p3, p4]).then(([m, t, e, g]) => {
      console.log('[PUBLIC_HOME] .then() CALLED. m =', m, 't =', t, 'g =', g);
      console.log('[PUBLIC_HOME] m.length =', m?.length, 't.length =', t?.length, 'g.length =', g?.length);
      const finalM = m && m.length > 0 ? m : fallbackMembers;
      const finalT = t && t.length > 0 ? t : fallbackTournaments;
      const finalG = g && g.length > 0 ? g : fallbackGallery;
      console.log('[PUBLIC_HOME] Setting state. finalM.length =', finalM.length);
      setMembers(finalM);
      setTournaments(finalT);
      setGallery(finalG);
    }).catch(err => {
      console.error('[PUBLIC_HOME] .then() THREW:', err);
      setMembers(fallbackMembers);
      setTournaments(fallbackTournaments);
      setGallery(fallbackGallery);
    }).finally(() => {
      console.log('[PUBLIC_HOME] .finally() CALLED - setting loading=false');
      setLoading(false);
    });
  }, []);

  const totalWins = members.reduce((s, m) => s + (parseInt(m.wins) || 0), 0);
  const leaders = members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role));
  const displayLeaders = leaders.length > 0 ? leaders : fallbackLeaders;
  const activeNotifs = notifications.filter(n => !dismissedNotifs.has(n.id));

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] mx-auto mb-6 animate-pulse" />
          <div className="h-12 w-64 bg-[rgba(255,255,255,0.06)] rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-6 w-48 bg-[rgba(255,255,255,0.04)] rounded-xl mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Notifications Bar */}
      {activeNotifs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
        >
          {activeNotifs.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: i * 0.15 }}
              className="glass-deep rounded-[14px] p-3 flex items-start gap-3 group shadow-xl"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${n.color}20` }}
              >
                <Bell size={14} style={{ color: n.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.text}</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">{n.time}</p>
              </div>
              <button
                onClick={() => setDismissedNotifs(prev => new Set(prev).add(n.id))}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <X size={14} className="text-[#6B7280] hover:text-white" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 md:py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.06)] via-transparent to-[rgba(139,92,246,0.04)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[rgba(0,229,255,0.03)] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
          className="w-32 h-32 rounded-2xl mx-auto mb-6 shadow-[0_0_60px_rgba(0,229,255,0.3)] relative overflow-hidden"
        >
          <img src="/images/clan-logo.png" alt="SYRIA FOUR" className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-[#00E5FF]', 'to-[#8B5CF6]');
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-4xl tracking-tighter">S4</span>';
            }}
          />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[rgba(139,92,246,0.4)] animate-float">
            <Sparkles size={14} className="text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-l from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent"
        >
          SYRIA FOUR
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#9CA3AF] text-lg md:text-xl"
        >
          كلان فري فاير - القمة تبدأ من هنا
        </motion.p>
      </motion.div>

      {/* Main Stats - Animated Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <AnimatedStatCard icon={<Users size={28} />} value={120} label="Members" suffix="+" delay={0} color="#00E5FF" />
        <AnimatedStatCard icon={<Swords size={28} />} value={15} label="Tournaments" suffix="+" delay={0.1} color="#8B5CF6" />
        <AnimatedStatCard icon={<Trophy size={28} />} value={380} label="Wins" suffix="+" delay={0.2} color="#FFD700" />
        <AnimatedStatCard icon={<Eye size={28} />} value={40} label="Views" suffix="K+" delay={0.3} color="#00E676" />
      </div>

      {/* Stats Cards */}
      <div>
        <SectionHeader icon={<Zap size={20} className="text-[#00E5FF]" />} title="الإحصائيات" subtitle="أرقام الكلان" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Members", value: 125, icon: <Users size={20} />, color: "#00E5FF" },
            { label: "News", value: 42, icon: <Bell size={20} />, color: "#8B5CF6" },
            { label: "Images", value: 810, icon: <ImageIcon size={20} />, color: "#00E676" },
            { label: "Videos", value: 77, icon: <FileVideo size={20} />, color: "#FFD700" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <GlassCard className="text-center py-5 group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <p className="text-2xl font-black tabular-nums">
                  <AnimatedCounter to={s.value} duration={1.5} />
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{s.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Members Section - Cards with tournaments count */}
      <div>
        <SectionHeader icon={<Users size={20} className="text-[#00E5FF]" />} title="الأعضاء" subtitle={`${members.length} عضو`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.slice(0, 6).map((m, i) => (
            <motion.div
              key={m.id || i}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <GlassCard className="text-center py-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Avatar src={m.image || ""} name={m.name} size="xl" className="mx-auto mb-3 ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-2 ring-offset-[#050816] rounded-full" />
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
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-[#6B7280]">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#00E5FF] tabular-nums">{m.tournaments || m.wins || 0}</p>
                    <p className="text-[10px]">بطولات</p>
                  </div>
                  <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#8B5CF6] tabular-nums">{m.level || "—"}</p>
                    <p className="text-[10px]">مستوى</p>
                  </div>
                  <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#FFD700] tabular-nums">{m.wins || 0}</p>
                    <p className="text-[10px]">فوز</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-6 md:p-8 relative overflow-hidden glow-border">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[rgba(0,229,255,0.03)] rounded-full blur-[60px]" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-[14px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center shrink-0">
              <Target size={24} className="text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">من نحن</h2>
              <p className="text-[#9CA3AF] leading-relaxed">
                SYRIA FOUR هو كلان فري فاير سوري يضم نخبة من اللاعبين المحترفين.
                نشارك في البطولات المحلية والعالمية، ونسعى دائمًا لتحقيق الانتصارات
                ورفع اسم سوريا عاليًا في عالم الألعاب الإلكترونية.
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1"><Zap size={14} className="text-[#00E5FF]" /> تأسس 2020</span>
                <span className="flex items-center gap-1"><Users size={14} className="text-[#8B5CF6]" /> {members.length}+ عضو</span>
                <span className="flex items-center gap-1"><Trophy size={14} className="text-[#FFD700]" /> {tournaments.length} بطولة</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Leaders Section */}
      {displayLeaders.length > 0 && (
        <div>
          <SectionHeader icon={<Crown size={20} className="text-[#FFD700]" />} title="القيادات" subtitle="قادة الكلان" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayLeaders.slice(0, 6).map((l, i) => (
              <motion.div
                key={l.id || i}
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <GlassCard className="text-center py-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,229,255,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Avatar src={l.image || ""} name={l.name} size="xl" className="mx-auto mb-3" />
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

      {/* Vision & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
        initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[rgba(0,229,255,0.03)] rounded-full blur-[40px]" />
            <div className="relative z-10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldIcon size={18} className="text-[#00E5FF]" /> رؤيتنا
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                نطمح أن نكون أفضل كلان فري فاير في سوريا والمنطقة العربية،
                من خلال التدريب المستمر والمشاركة في البطولات الكبرى.
              </p>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div
        initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[rgba(139,92,246,0.03)] rounded-full blur-[40px]" />
            <div className="relative z-10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <StarIcon size={18} className="text-[#8B5CF6]" /> قيمنا
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                الانضباط، الاحترام، والعمل الجماعي هم أساس نجاحنا.
                نؤمن بأن الفريق القوي يبني أفرادًا أقوياء.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Tournaments Section */}
      {tournaments.length > 0 && (
        <div>
          <SectionHeader icon={<Swords size={20} className="text-[#8B5CF6]" />} title="البطولات" subtitle="آخر البطولات" />
          <div className="grid gap-4">
            {tournaments.slice(0, 4).map((t, i) => (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2 }}
              >
                <GlassCard hover className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[rgba(139,92,246,0.03)] rounded-full blur-[40px]" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-[14px] bg-[rgba(139,92,246,0.12)] flex items-center justify-center shrink-0 overflow-hidden">
                        {t.logo ? (
                          <img src={t.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Medal size={24} className="text-[#8B5CF6]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base">{t.name}</h3>
                        {t.description && <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{t.description}</p>}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                            style={{
                              backgroundColor: t.type === "upcoming" ? "rgba(0,229,255,0.12)" :
                                t.type === "current" ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.06)",
                              color: t.type === "upcoming" ? "#00E5FF" :
                                t.type === "current" ? "#00E676" : "#9CA3AF",
                            }}
                          >
                            {t.type === "upcoming" ? "قادمة" : t.type === "current" ? "جارية" : "سابقة"}
                          </span>
                          {t.mode && <span className="text-[11px] text-[#6B7280]">{t.mode}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-[#6B7280]">
                      {t.type !== "previous" && t.startDate && (
                        <div className="flex items-center gap-1.5 glass-light rounded-[10px] px-3 py-1.5">
                          <Clock size={12} className="text-[#00E5FF]" />
                          <CountdownTimer targetDate={t.startDate} />
                        </div>
                      )}
                      {t.teamsCount && (
                        <span className="flex items-center gap-1">
                          <Users2 size={14} className="text-[#8B5CF6]" /> {t.teamsCount} فريق
                        </span>
                      )}
                      {(t.prizeValue || t.prizeType) && (
                        <span className="flex items-center gap-1">
                          <Gift size={14} className="text-[#FFD700]" /> {t.prizeValue} {t.prizeType}
                        </span>
                      )}
                      {t.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} className="text-[#9CA3AF]" /> {new Date(t.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
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
          <SectionHeader icon={<ImageIcon size={20} className="text-[#00E676]" />} title="المعرض" subtitle="صور الكلان" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-[14px] overflow-hidden aspect-square group cursor-pointer relative"
              >
                <img src={img.src} alt={img.label || ""}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-sm font-semibold">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section for Tournaments - drag & drop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6">
          <SectionHeader icon={<FileVideo size={20} className="text-[#8B5CF6]" />} title="رفع الملفات" subtitle="اسحب وأفلت الصور والفيديوهات" />
          <div
            className="border-2 border-dashed border-[rgba(139,92,246,0.2)] rounded-[14px] p-8 text-center transition-all duration-300 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.03)]"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)"; e.currentTarget.style.backgroundColor = "rgba(0,229,255,0.03)"; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"; e.currentTarget.style.backgroundColor = "transparent"; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
              e.currentTarget.style.backgroundColor = "transparent";
              const files = Array.from(e.dataTransfer.files);
              files.forEach(f => {
                const formData = new FormData();
                formData.append("file", f);
                fetch("/api/upload", { method: "POST", body: formData });
              });
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={28} className="text-[#8B5CF6]" />
            </div>
            <p className="text-sm text-[#9CA3AF] mb-2">اسحب وأفلت الصور أو الفيديوهات هنا</p>
            <label className="inline-block px-6 py-2.5 rounded-[12px] bg-[#00E5FF] text-[#050816] text-sm font-bold cursor-pointer hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-300">
              اختر من الجهاز
              <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(f => {
                  const formData = new FormData();
                  formData.append("file", f);
                  fetch("/api/upload", { method: "POST", body: formData });
                });
              }} />
            </label>
          </div>
        </GlassCard>
      </motion.div>

    </div>
  );
}

function ShieldIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function StarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
