"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import {
  Users, Swords, Trophy, Eye,
  Zap, Sparkles, Bell,
  Image as ImageIcon, FileVideo, Medal, Crown, Shield,
  Star, Diamond, Gift, MapPin, Award, Flame, Crosshair
} from "lucide-react";

const fallbackAwards = [
  { id: "1", title: "مؤسس الكلان", holderName: "AAK Khalid", description: "مؤسس ورئيس كلان SYRIA FOUR", icon: "" },
  { id: "2", title: "أقوى لاعب حروب", holderName: "Qusai", description: "الأكثر فوزاً في الحروب", icon: "" },
  { id: "3", title: "أقوى لاعب بطولات", holderName: "Za3im", description: "الأكثر تتويجاً بالبطولات", icon: "" },
  { id: "4", title: "داعم الكلان", holderName: "Sniper", description: "الداعم الأول للكلان", icon: "" },
];

const fallbackVip = [
  { id: "1", title: "عضوية VIP", description: "إطار ذهبي، شارة VIP، مزايا حصرية، أولوية الدعم", instagram1: "qusai7r", instagram2: "aak.811", isEnabled: true },
];

const fallbackHallOfFame = [
  { id: "1", title: "أكثر لاعب نشطاً", playerName: "AAK Khalid", description: "الأكثر نشاطاً وتواجداً", image: "" },
  { id: "2", title: "أقوى لاعب رومات", playerName: "Qusai", description: "الأقوى في الرومات", image: "" },
  { id: "3", title: "أقوى لاعب رانكد", playerName: "Za3im", description: "الأعلى في الرانكد", image: "" },
  { id: "4", title: "أقوى لاعب", playerName: "AAK Khalid", description: "أقوى لاعب في الكلان", image: "" },
];

const awardIcons: Record<string, any> = {
  "مؤسس الكلان": Crown,
  "أقوى لاعب حروب": Swords,
  "أقوى لاعب بطولات": Trophy,
  "داعم الكلان": Gift,
};

const awardColors: Record<string, string> = {
  "مؤسس الكلان": "#FFD700",
  "أقوى لاعب حروب": "#FF3B30",
  "أقوى لاعب بطولات": "#8B5CF6",
  "داعم الكلان": "#00E676",
};

export default function HomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [vipSettings, setVipSettings] = useState<any[]>([]);
  const [hallOfFame, setHallOfFame] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getAwards().catch(() => fallbackAwards),
      api.getVipSettings().catch(() => fallbackVip),
      api.getHallOfFame().catch(() => fallbackHallOfFame),
    ]).then(([m, a, v, h]) => {
      setMembers(m.length > 0 ? m : []);
      setAwards(a.length > 0 ? a : fallbackAwards);
      setVipSettings(v.length > 0 ? v : fallbackVip);
      setHallOfFame(h.length > 0 ? h : fallbackHallOfFame);
    }).catch(() => {
      setAwards(fallbackAwards);
      setVipSettings(fallbackVip);
      setHallOfFame(fallbackHallOfFame);
    }).finally(() => setLoading(false));
  }, []);

  const vip = vipSettings[0];
  const activeMembers = members.filter(m => m.role && ["leader", "vice", "chief", "elite", "member"].includes(m.role));

  return (
    <PublicLayout>
      <div className="space-y-10">

        {/* Hero Banner */}
        <div className="fade-in text-center py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.06)] via-transparent to-[rgba(139,92,246,0.04)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[rgba(0,229,255,0.03)] blur-[100px] pointer-events-none" />
          <div className="fade-in w-32 h-32 rounded-2xl mx-auto mb-6 shadow-[0_0_60px_rgba(0,229,255,0.3)] relative overflow-hidden" style={{ animationDelay: "0.2s" }}>
            <img src="/images/clan-logo.png" alt="SYRIA FOUR" className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-[#00E5FF]', 'to-[#8B5CF6]');
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-4xl tracking-tighter">S4</span>';
              }}
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[rgba(139,92,246,0.4)]">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>
          <h1 className="fade-in text-4xl md:text-6xl font-black mb-3 bg-gradient-to-l from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent" style={{ animationDelay: "0.4s" }}>
            SYRIA FOUR
          </h1>
          <p className="fade-in text-[#9CA3AF] text-lg md:text-xl" style={{ animationDelay: "0.6s" }}>
            كلان فري فاير - القمة تبدأ من هنا
          </p>
        </div>

        {/* القسم الأول: إحصائيات رئيسية */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
              <Zap size={20} className="text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">إحصائيات الكلان</h2>
              <p className="text-xs text-[#9CA3AF]">أرقام SYRIA FOUR</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: <Users size={24} />, value: activeMembers.length || 120, label: "إجمالي الأعضاء", suffix: "", delay: 0, color: "#00E5FF", desc: "عضو في الكلان" },
              { icon: <Swords size={24} />, value: 28, label: "الحروب هذا الشهر", suffix: "", delay: 0.1, color: "#FF3B30", desc: "حرب شهرية" },
              { icon: <Trophy size={24} />, value: 15, label: "البطولات", suffix: "+", delay: 0.2, color: "#FFD700", desc: "بطولة رسمية" },
              { icon: <Diamond size={24} />, value: 50, label: "الجواهر الموزعة", suffix: "K+", delay: 0.3, color: "#00E676", desc: "جوائز للأعضاء" },
            ].map((s, i) => (
              <div key={s.label} className="fade-in relative group" style={{ animationDelay: `${s.delay}s` }}>
                <div className="absolute -inset-0.5 rounded-[20px] bg-gradient-to-b from-[rgba(0,229,255,0.1)] to-[rgba(139,92,246,0.05)] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                <GlassCard className="text-center py-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]" style={{ backgroundColor: `${s.color}15` }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                  </div>
                  <p className="text-3xl md:text-4xl font-black tabular-nums text-white">
                    <AnimatedCounter to={s.value} suffix={s.suffix} duration={2} />
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[10px] text-[#6B7280] mt-1">{s.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* القسم الثاني: الأوسمة النادرة */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,215,0,0.1)] flex items-center justify-center">
              <Medal size={20} className="text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">الأوسمة النادرة</h2>
              <p className="text-xs text-[#9CA3AF]">أوسمة وشخصيات SYRIA FOUR</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {awards.map((a, i) => {
              const Icon = awardIcons[a.title] || Medal;
              const color = awardColors[a.title] || "#FFD700";
              return (
                <div key={a.id || i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GlassCard className="text-center py-6 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]" style={{ backgroundColor: `${color}20` }}>
                      <Icon size={28} style={{ color }} />
                    </div>
                    <h3 className="font-bold text-base">{a.title}</h3>
                    <p className="text-sm font-semibold mt-1" style={{ color }}>{a.holderName}</p>
                    {a.description && <p className="text-[10px] text-[#6B7280] mt-1">{a.description}</p>}
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* القسم الثالث: عضوية VIP */}
        {vip && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,215,0,0.1)] flex items-center justify-center">
                <Crown size={20} className="text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">عضوية VIP</h2>
                <p className="text-xs text-[#9CA3AF]">مزايا حصرية لأعضاء SYRIA FOUR</p>
              </div>
            </div>
            <GlassCard className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FF6B35] to-[#FFD700]" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[rgba(255,215,0,0.05)] rounded-full blur-[60px]" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black bg-gradient-to-l from-[#FFD700] to-[#FF6B35] bg-clip-text text-transparent">{vip.title}</h3>
                  <p className="text-sm text-[#9CA3AF]">{vip.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["إطار ذهبي", "شارة VIP", "مزايا حصرية", "أولوية الدعم"].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-[10px] bg-[rgba(255,215,0,0.06)]">
                        <Star size={14} className="text-[#FFD700]" />
                        <span className="text-xs font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                    <Crown size={36} className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-[#FFD700]">اشترك الآن</p>
                  <div className="flex flex-col gap-2 w-full">
                    {vip.instagram1 && (
                      <a href={`https://instagram.com/${vip.instagram1}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[12px] bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black font-bold text-sm hover:scale-[1.02] transition-all no-underline"
                      >
                        <Star size={16} /> {vip.instagram1}
                      </a>
                    )}
                    {vip.instagram2 && (
                      <a href={`https://instagram.com/${vip.instagram2}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[12px] bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black font-bold text-sm hover:scale-[1.02] transition-all no-underline"
                      >
                        <Star size={16} /> {vip.instagram2}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* القسم الرابع: خريطة أعضاء الكلان */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
              <MapPin size={20} className="text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">خريطة أعضاء الكلان</h2>
              <p className="text-xs text-[#9CA3AF]">توزيع أعضاء SYRIA FOUR حول العالم</p>
            </div>
          </div>
          <GlassCard className="p-6 text-center">
            <div className="relative w-full h-[200px] md:h-[300px] rounded-[16px] overflow-hidden bg-gradient-to-b from-[rgba(0,229,255,0.03)] to-[rgba(139,92,246,0.03)] flex items-center justify-center">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,229,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(255,215,0,0.04) 0%, transparent 50%)"
              }} />
              <div className="relative z-10 text-center">
                <MapPin size={48} className="text-[#00E5FF] mx-auto mb-3 opacity-50" />
                <p className="text-lg font-bold">سوريا</p>
                <p className="text-sm text-[#6B7280]">جميع الأعضاء من سوريا 🇸🇾</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {activeMembers.slice(0, 10).map((m, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                      {(m.name || "?").charAt(0)}
                    </div>
                  ))}
                  {activeMembers.length > 10 && (
                    <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[10px] text-[#6B7280]">
                      +{activeMembers.length - 10}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* القسم الخامس: قاعة المشاهير */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,215,0,0.1)] flex items-center justify-center">
              <Award size={20} className="text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">قاعة مشاهير الكلان</h2>
              <p className="text-xs text-[#9CA3AF]">أفضل لاعبي SYRIA FOUR</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hallOfFame.map((h, i) => (
              <div key={h.id || i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <GlassCard className="text-center py-6 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#8B5CF6] to-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {h.image ? (
                    <img src={h.image} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-[rgba(255,215,0,0.3)]" />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                      <Trophy size={24} className="text-white" />
                    </div>
                  )}
                  <h3 className="font-bold text-sm">{h.title}</h3>
                  <p className="text-lg font-black mt-1 bg-gradient-to-l from-[#FFD700] to-[#FF6B35] bg-clip-text text-transparent">{h.playerName}</p>
                  {h.description && <p className="text-[10px] text-[#6B7280] mt-1">{h.description}</p>}
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
