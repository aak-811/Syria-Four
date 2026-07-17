"use client";

import { useState, useEffect, useRef } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import {
  Swords, Trophy, Sparkles,
  Medal, Crown,
  Star, Gift, Award,
  ZoomIn, Globe as GlobeIcon
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

const countryPositions: Record<string, { x: number; y: number }> = {
  SY: { x: 52, y: 38 }, SA: { x: 55, y: 40 }, AE: { x: 58, y: 37 },
  EG: { x: 51, y: 45 }, IQ: { x: 54, y: 36 }, JO: { x: 52, y: 41 },
  LB: { x: 52, y: 36 }, PS: { x: 52, y: 40 }, QA: { x: 57, y: 39 },
  BH: { x: 57, y: 40 }, KW: { x: 56, y: 41 }, OM: { x: 59, y: 42 },
  YE: { x: 55, y: 48 },
};

export default function HomePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>(fallbackAwards);
  const [vipSettings, setVipSettings] = useState<any[]>(fallbackVip);
  const [hallOfFame, setHallOfFame] = useState<any[]>(fallbackHallOfFame);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map state
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapPos, setMapPos] = useState({ x: 0, y: 0 });
  const [mapScale, setMapScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => []),
      api.getAwards().catch(() => fallbackAwards),
      api.getVipSettings().catch(() => fallbackVip),
      api.getHallOfFame().catch(() => fallbackHallOfFame),
      api.getLeaderboard().catch(() => []),
    ]).then(([m, t, a, v, h, lb]) => {
      setMembers(m.length > 0 ? m : []);
      setTournaments(t.length > 0 ? t : []);
      if (a.length > 0) setAwards(a);
      if (v.length > 0) setVipSettings(v);
      if (h.length > 0) setHallOfFame(h);
      setLeaderboard(lb.length > 0 ? lb : []);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);

  const vip = vipSettings[0];
  const activeMembers = members.filter(m => m.role && ["leader", "vice", "chief", "elite", "member"].includes(m.role));

  // Map handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPos.x, y: e.clientY - mapPos.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setMapScale(s => Math.max(0.5, Math.min(3, s + delta)));
  };
  const resetMap = () => { setMapPos({ x: 0, y: 0 }); setMapScale(1); };

  const countries = Object.keys(countryPositions);

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

        {/* القسم الرابع: خريطة أعضاء الكلان (تفاعلية) */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
              <GlobeIcon size={20} className="text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">خريطة أعضاء الكلان</h2>
              <p className="text-xs text-[#9CA3AF]">اسحب الخريطة للتجوال - استخدم عجلة الماوس للتقريب</p>
            </div>
          </div>
          <GlassCard className="p-2 md:p-4 text-center overflow-hidden">
            <div className="relative w-full h-[300px] md:h-[450px] rounded-[16px] overflow-hidden bg-gradient-to-b from-[rgba(0,229,255,0.03)] to-[rgba(139,92,246,0.03)]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }} />
              {/* Map Container */}
              <div className="absolute inset-0 transition-transform duration-100"
                style={{ transform: `translate(${mapPos.x}px, ${mapPos.y}px) scale(${mapScale})` }}>
                {/* World Map SVG Outline (simplified) */}
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-[0.08]" preserveAspectRatio="xMidYMid meet">
                  <path d="M300,160 L320,155 L340,158 L350,165 L345,175 L330,180 L310,178 Z" fill="white" />
                  <path d="M280,180 L300,175 L310,185 L305,195 L290,198 L278,192 Z" fill="white" />
                  <path d="M350,165 L370,160 L390,165 L395,175 L380,182 L360,180 Z" fill="white" />
                  <path d="M240,200 L260,195 L275,205 L270,215 L255,218 L238,212 Z" fill="white" />
                  <path d="M380,150 L400,145 L420,150 L425,160 L410,165 L390,162 Z" fill="white" />
                  <path d="M150,120 L180,115 L200,120 L195,135 L170,140 L145,132 Z" fill="white" />
                  <path d="M550,130 L580,125 L600,130 L595,145 L570,150 L545,142 Z" fill="white" />
                  <path d="M500,180 L530,175 L545,185 L540,200 L520,205 L495,198 Z" fill="white" />
                  <path d="M200,150 L230,145 L245,155 L240,170 L220,175 L195,168 Z" fill="white" />
                  <circle cx="400" cy="190" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <circle cx="400" cy="190" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </svg>
                {/* Country Markers */}
                {countries.map(code => {
                  const pos = countryPositions[code];
                  const countryMembers = activeMembers.filter(m => m.country === code);
                  return (
                    <div key={code}
                      className="absolute group/marker"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                      onMouseEnter={() => setHoveredCountry(code)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >
                      <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-125 ${countryMembers.length > 0 ? "bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] animate-pulse-slow" : "bg-[rgba(255,255,255,0.08)]"}`}
                        style={{ animationDelay: `${countries.indexOf(code) * 0.3}s` }}>
                        <span className="text-[7px] md:text-[9px] font-bold text-white">{code}</span>
                      </div>
                      {/* Tooltip */}
                      {hoveredCountry === code && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20">
                          <div className="bg-[rgba(0,0,0,0.9)] backdrop-blur-[10px] rounded-[12px] p-3 shadow-xl min-w-[150px] border border-[rgba(255,255,255,0.06)]">
                            <p className="text-xs font-bold text-white mb-1">{code === "SY" ? "سوريا" : code === "SA" ? "السعودية" : code === "AE" ? "الإمارات" : code === "EG" ? "مصر" : code === "IQ" ? "العراق" : code === "JO" ? "الأردن" : code === "LB" ? "لبنان" : code === "PS" ? "فلسطين" : code === "QA" ? "قطر" : code === "BH" ? "البحرين" : code === "KW" ? "الكويت" : code === "OM" ? "عمان" : code === "YE" ? "اليمن" : code}</p>
                            <p className="text-[10px] text-[#9CA3AF] mb-2">{countryMembers.length} عضو</p>
                            <div className="flex flex-wrap gap-1">
                              {countryMembers.slice(0, 6).map((m, idx) => (
                                <div key={idx} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-[8px] font-bold text-white" title={m.name}>
                                  {(m.name || "?").charAt(0)}
                                </div>
                              ))}
                              {countryMembers.length > 6 && (
                                <div className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[8px] text-[#6B7280]">
                                  +{countryMembers.length - 6}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Controls */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <button onClick={() => setMapScale(s => Math.min(3, s + 0.3))}
                  className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-[10px] flex items-center justify-center text-white hover:bg-[rgba(0,229,255,0.3)] transition-all border-0 cursor-pointer">
                  <ZoomIn size={14} />
                </button>
                <button onClick={() => setMapScale(s => Math.max(0.5, s - 0.3))}
                  className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-[10px] flex items-center justify-center text-white hover:bg-[rgba(0,229,255,0.3)] transition-all border-0 cursor-pointer">
                  <ZoomIn size={14} style={{ transform: "rotate(45deg)" }} />
                </button>
                <button onClick={resetMap}
                  className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-[10px] flex items-center justify-center text-white hover:bg-[rgba(0,229,255,0.3)] transition-all border-0 cursor-pointer">
                  <GlobeIcon size={14} />
                </button>
              </div>
            </div>
          </GlassCard>
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
