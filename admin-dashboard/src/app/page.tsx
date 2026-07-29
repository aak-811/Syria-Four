"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import {
  Swords, Trophy, Sparkles,
  Medal, Crown,
  Star, Gift,
  Camera, ExternalLink, Heart, MessageCircle, Users,
  Bot, Clock, Image as ImageIcon, Calendar, ChevronLeft,
  Shield, MapPin, ShoppingBag, Diamond, Award
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

const fallbackInstagram = [
  { id: "1", name: "أبو أمير", username: "aak.811", icon: "crown" },
  { id: "2", name: "قصي | QUSAI", username: "qusai7r", icon: "crown" },
  { id: "3", name: "Abu", username: "@Aak.811", icon: "crown" },
];

const assistantSuggestions = [
  "كيف أنضم إلى الكلان؟",
  "ما هي قوانين الكلان؟",
  "ما هي مزايا VIP؟",
  "كيف أشحن جواهر؟",
];

export default function HomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>(fallbackAwards);
  const [vipSettings, setVipSettings] = useState<any[]>(fallbackVip);
  const [instagram, setInstagram] = useState<any[]>(fallbackInstagram);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => []),
      api.getAwards().catch(() => fallbackAwards),
      api.getVipSettings().catch(() => fallbackVip),
      api.getInstagram().catch(() => fallbackInstagram),
      api.getLeaderboard().catch(() => []),
      api.getEvents().catch(() => []),
      api.getGallery().catch(() => []),
    ]).then(([m, t, a, v, insta, lb, e, g]) => {
      setMembers(m.length > 0 ? m : []);
      setTournaments(t.length > 0 ? t : []);
      if (a.length > 0) setAwards(a);
      if (v.length > 0) setVipSettings(v);
      if (insta.length > 0) setInstagram(insta);
      setLeaderboard(lb.length > 0 ? lb : []);
      setEvents(e.length > 0 ? e : []);
      setGallery(g.length > 0 ? g : []);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);

  const vip = vipSettings[0];
  const currentTournaments = tournaments.filter(t => t.type === "current" || t.type === "upcoming").slice(0, 3);
  const recentEvents = events.slice(0, 3);
  const galleryImages = gallery.slice(0, 4);

  return (
    <PublicLayout>
      <div className="space-y-10">

        <div className="fade-in text-center py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.06)] via-transparent to-[rgba(139,92,246,0.04)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(0,229,255,0.03)] blur-[100px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
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

        {currentTournaments.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
                <Swords size={20} className="text-[#8B5CF6]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">البطولات</h2>
                <p className="text-xs text-[#9CA3AF]">البطولات الحالية والقادمة</p>
              </div>
              <Link href="/tournaments" className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 no-underline">
                عرض المزيد <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTournaments.map((t, i) => (
                <div key={t.id || i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GlassCard className="p-4 text-center group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Swords size={24} className="mx-auto mb-2 text-[#8B5CF6]" />
                    <h3 className="font-bold text-sm">{t.name}</h3>
                    <p className="text-[10px] text-[#6B7280] mt-1">{t.mode || ""} {t.teamsCount ? `- ${t.teamsCount} فريق` : ""}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.type === "current" ? "bg-[rgba(0,230,118,0.12)] text-[#00E676]" : "bg-[rgba(0,229,255,0.12)] text-[#00E5FF]"}`}>
                      {t.type === "current" ? "جارية" : "قادمة"}
                    </span>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,215,0,0.1)] flex items-center justify-center">
                <Calendar size={20} className="text-[#FFD700]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">الفعاليات</h2>
                <p className="text-xs text-[#9CA3AF]">أحدث الفعاليات والأنشطة</p>
              </div>
              <Link href="/events" className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 no-underline">
                عرض المزيد <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentEvents.map((e, i) => (
                <div key={e.id || i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GlassCard className="p-4 text-center group relative overflow-hidden">
                    <Calendar size={24} className="mx-auto mb-2 text-[#FFD700]" />
                    <h3 className="font-bold text-sm">{e.title}</h3>
                    <p className="text-[10px] text-[#6B7280] mt-1">{e.description?.slice(0, 40)}</p>
                    {e.prize && <span className="text-[10px] text-[#FFD700] mt-1 block">{e.prize}</span>}
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Assistant Snippet */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">المساعد الذكي</h2>
              <p className="text-xs text-[#9CA3AF]">استفسارات سريعة عن الكلان</p>
            </div>
            <Link href="/assistant" className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 no-underline">
              عرض المزيد <ChevronLeft size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {assistantSuggestions.map((q, i) => (
              <Link key={i} href="/assistant"
                className="glass rounded-[14px] p-3 text-center hover:bg-[rgba(255,255,255,0.06)] transition-all no-underline"
              >
                <Sparkles size={16} className="mx-auto mb-1 text-[#00E5FF]" />
                <p className="text-[11px] font-medium text-[#9CA3AF]">{q}</p>
              </Link>
            ))}
          </div>
        </div>

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
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {instagram.map((acc, i) => {
              const username = acc.username.replace("@", "");
              return (
                <div key={acc.id || i} className="fade-in group" style={{ animationDelay: `${i * 0.15}s` }}>
                  <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer"
                    className="block glass rounded-[14px] p-3 md:p-4 text-center relative overflow-hidden hover:scale-[1.02] transition-all duration-500 no-underline"
                  >
                    <div className="relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mx-auto mb-2 bg-gradient-to-br shadow-[0_0_20px_rgba(225,48,108,0.3)] flex items-center justify-center p-[2px]"
                        style={{ background: `linear-gradient(135deg, ${i === 0 ? "#E1306C" : i === 1 ? "#FCAF45" : "#833AB4"}, ${i === 0 ? "#833AB4" : i === 1 ? "#E1306C" : "#405DE6"})` }}>
                        <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center">
                          <Camera size={14} className="text-white md:w-[18px]" />
                        </div>
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-white truncate">{acc.name}</h3>
                      <p className="text-[10px] font-semibold truncate bg-gradient-to-l bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to left, ${i === 0 ? "#E1306C, #833AB4" : i === 1 ? "#FCAF45, #E1306C" : "#833AB4, #405DE6"})` }}>
                        @{username}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {galleryImages.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,107,53,0.1)] flex items-center justify-center">
                <ImageIcon size={20} className="text-[#FF6B35]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">معرض الصور</h2>
                <p className="text-xs text-[#9CA3AF]">صور من الكلان</p>
              </div>
              <Link href="/gallery" className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 no-underline">
                عرض المزيد <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <div key={img.id || i} className="fade-in rounded-[14px] overflow-hidden aspect-video" style={{ animationDelay: `${i * 0.1}s` }}>
                  <img src={img.src} alt={img.label || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

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

      </div>
    </PublicLayout>
  );
}
