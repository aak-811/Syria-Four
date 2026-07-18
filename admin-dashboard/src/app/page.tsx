"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import {
  Swords, Trophy, Sparkles,
  Medal, Crown,
  Star, Gift, Award,
  Camera, ExternalLink, Heart, MessageCircle, Users
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

const fallbackInstagram = [
  { id: "1", name: "أبو أمير", username: "aak.811", icon: "crown" },
  { id: "2", name: "قصي | QUSAI", username: "qusai7r", icon: "crown" },
  { id: "3", name: "Abu", username: "@Aak.811", icon: "crown" },
];

export default function HomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>(fallbackAwards);
  const [vipSettings, setVipSettings] = useState<any[]>(fallbackVip);
  const [hallOfFame, setHallOfFame] = useState<any[]>(fallbackHallOfFame);
  const [instagram, setInstagram] = useState<any[]>(fallbackInstagram);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => []),
      api.getAwards().catch(() => fallbackAwards),
      api.getVipSettings().catch(() => fallbackVip),
      api.getHallOfFame().catch(() => fallbackHallOfFame),
      api.getInstagram().catch(() => fallbackInstagram),
      api.getLeaderboard().catch(() => []),
    ]).then(([m, t, a, v, h, insta, lb]) => {
      setMembers(m.length > 0 ? m : []);
      setTournaments(t.length > 0 ? t : []);
      if (a.length > 0) setAwards(a);
      if (v.length > 0) setVipSettings(v);
      if (h.length > 0) setHallOfFame(h);
      if (insta.length > 0) setInstagram(insta);
      setLeaderboard(lb.length > 0 ? lb : []);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);

  const vip = vipSettings[0];

  return (
    <PublicLayout>
      <div className="space-y-10">

        {/* Hero Banner - Logo beside title on desktop */}
        <div className="fade-in text-center py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.06)] via-transparent to-[rgba(139,92,246,0.04)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(0,229,255,0.03)] blur-[100px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
            {/* Animated Logo */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl shadow-[0_0_60px_rgba(0,229,255,0.3)] relative overflow-hidden animate-logo-float"
              style={{ animation: "logoFloat 3s ease-in-out infinite" }}>
              <img src="/images/clan-logo.png" alt="SYRIA FOUR" className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-[#00E5FF]', 'to-[#8B5CF6]');
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-4xl tracking-tighter">S4</span>';
                }}
              />
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[rgba(139,92,246,0.4)]">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-6xl font-black mb-2 bg-gradient-to-l from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent">
                SYRIA FOUR
              </h1>
              <p className="text-[#9CA3AF] text-lg md:text-xl">كلان فري فاير - القمة تبدأ من هنا</p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>

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
              const awardIconMap: Record<string, any> = { "مؤسس الكلان": Crown, "أقوى لاعب حروب": Swords, "أقوى لاعب بطولات": Trophy, "داعم الكلان": Gift };
              const Icon = awardIconMap[a.title] || Medal;
              const color = a.title === "مؤسس الكلان" ? "#FFD700" : a.title === "أقوى لاعب حروب" ? "#FF3B30" : a.title === "أقوى لاعب بطولات" ? "#8B5CF6" : a.title === "داعم الكلان" ? "#00E676" : "#FFD700";
              return (
                <div key={a.id || i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GlassCard className="text-center py-6 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {a.icon ? (
                      <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-[rgba(255,215,0,0.2)] transition-all duration-300 group-hover:scale-110">
                        <img src={a.icon} alt={a.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]" style={{ backgroundColor: `${color}20` }}>
                        <Icon size={28} style={{ color }} />
                      </div>
                    )}
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
                      ><Star size={16} /> {vip.instagram1}</a>
                    )}
                    {vip.instagram2 && (
                      <a href={`https://instagram.com/${vip.instagram2}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[12px] bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black font-bold text-sm hover:scale-[1.02] transition-all no-underline"
                      ><Star size={16} /> {vip.instagram2}</a>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* القسم الرابع: حسابات إنستغرام */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center shadow-[0_0_20px_rgba(225,48,108,0.3)]">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">حسابات إنستغرام</h2>
              <p className="text-xs text-[#9CA3AF]">تابع حسابات SYRIA FOUR الرسمية</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instagram.map((acc, i) => {
              const username = acc.username.replace("@", "");
              const gradient = i === 0
                ? "from-[#E1306C] via-[#833AB4] to-[#405DE6]"
                : i === 1
                ? "from-[#FCAF45] via-[#E1306C] to-[#833AB4]"
                : "from-[#833AB4] via-[#405DE6] to-[#00E5FF]";
              return (
                <div key={acc.id || i} className="fade-in group" style={{ animationDelay: `${i * 0.15}s` }}>
                  <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer"
                    className="block glass rounded-[20px] p-6 text-center relative overflow-hidden hover:scale-[1.02] transition-all duration-500 no-underline"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] via-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[rgba(225,48,108,0.1)] to-transparent rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br shadow-[0_0_30px_rgba(225,48,108,0.3)] flex items-center justify-center p-[3px]"
                        style={{ background: `linear-gradient(135deg, ${i === 0 ? "#E1306C" : i === 1 ? "#FCAF45" : "#833AB4"}, ${i === 0 ? "#833AB4" : i === 1 ? "#E1306C" : "#405DE6"})` }}>
                        <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center">
                          <Camera size={28} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{acc.name}</h3>
                      <p className="text-sm font-semibold bg-gradient-to-l bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to left, ${i === 0 ? "#E1306C, #833AB4" : i === 1 ? "#FCAF45, #E1306C" : "#833AB4, #405DE6"})` }}>
                        @{username}
                      </p>
                      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><Heart size={12} className="text-[#E1306C]" /> متابعة</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} className="text-[#833AB4]" /> تواصل</span>
                      </div>
                      <div className="mt-4 px-4 py-2 rounded-[12px] text-xs font-bold text-white transition-all duration-300 group-hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${i === 0 ? "#E1306C" : i === 1 ? "#FCAF45" : "#833AB4"}, ${i === 0 ? "#833AB4" : i === 1 ? "#E1306C" : "#405DE6"})` }}>
                        <ExternalLink size={12} className="inline ml-1" /> زيارة الحساب
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E1306C] via-[#833AB4] to-[#405DE6] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* القسم الخامس: ترتيب اللاعبين (جوري + حروب رابطة) */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
              <Trophy size={20} className="text-[#8B5CF6]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">ترتيب اللاعبين</h2>
              <p className="text-xs text-[#9CA3AF]">جلوري وحروب رابطة</p>
            </div>
          </div>
          <GlassCard className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    <th className="text-right py-3 px-2 text-[#6B7280] font-semibold text-[11px]">#</th>
                    <th className="text-right py-3 px-2 text-[#6B7280] font-semibold text-[11px]">اللاعب</th>
                    <th className="text-center py-3 px-2 text-[#6B7280] font-semibold text-[11px]">جلوري</th>
                    <th className="text-center py-3 px-2 text-[#6B7280] font-semibold text-[11px]">حروب رابطة</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length > 0 ? leaderboard.sort((a, b) => (b.glory || 0) - (a.glory || 0)).map((p, i) => (
                    <tr key={p.id || i} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-3 px-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 0 ? "bg-[#FFD700] text-black" : i === 1 ? "bg-[#C0C0C0] text-black" : i === 2 ? "bg-[#CD7F32] text-white" : "bg-[rgba(255,255,255,0.06)] text-[#6B7280]"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Avatar src={p.image || ""} name={p.name} size="sm" className="w-7 h-7 text-[10px] rounded-full" />
                          <span className="font-semibold text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-[#FFD700]">{p.glory || 0}</td>
                      <td className="py-3 px-2 text-center font-bold text-[#00E5FF]">{p.wars || 0}</td>
                    </tr>
                  )) : members.sort((a, b) => (b.wins || 0) - (a.wins || 0)).slice(0, 10).map((m, i) => (
                    <tr key={m.id || i} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-3 px-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 0 ? "bg-[#FFD700] text-black" : i === 1 ? "bg-[#C0C0C0] text-black" : i === 2 ? "bg-[#CD7F32] text-white" : "bg-[rgba(255,255,255,0.06)] text-[#6B7280]"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold text-white">
                            {(m.name || "?").charAt(0)}
                          </div>
                          <span className="font-semibold text-sm">{m.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-[#FFD700]">{m.wins || 0}</td>
                      <td className="py-3 px-2 text-center font-bold text-[#00E5FF]">{m.tournaments || 0}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && members.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-[#6B7280] text-sm">لا توجد بيانات ترتيب متاحة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* القسم السادس: قاعة المشاهير */}
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
