"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Crown, Star, Shield, ArrowLeft, Camera, Users, Swords, Calendar, MessageSquare, LayoutDashboard, Phone, Gamepad2, Award } from "lucide-react";

const fallback = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, wins: 150, image: "", instagram: "aak.811", country: "SY", age: "25", playStyle: "Sniper", bio: "مؤسس ورئيس كلان SYRIA FOUR", goldFrame: true, vipBadge: true, nameColor: "#FFD700", profileColor: "#0a0a2e" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, wins: 120, image: "", instagram: "qusai7r", country: "SY", age: "23", playStyle: "Rusher", bio: "شريك القائد", goldFrame: true, vipBadge: true, nameColor: "#00E5FF", profileColor: "#0d1117" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, wins: 200, image: "", instagram: "", country: "SY", age: "22", playStyle: "Support", bio: "زعيم الكلان", goldFrame: false, vipBadge: false, nameColor: "#8B5CF6", profileColor: "#0a0a1a" },
];

const roleData: Record<string, { title: string; desc: string; icon: any; color: string; variant: "gold" | "success" | "danger" }> = {
  leader: { title: "القادة", desc: "قادة SYRIA FOUR الذين يقودون المسيرة", icon: Crown, color: "#FFD700", variant: "gold" },
  vice: { title: "شركاء القادة", desc: "شركاء القادة في SYRIA FOUR", icon: Star, color: "#00E676", variant: "success" },
  chief: { title: "الزعماء", desc: "زعماء SYRIA FOUR", icon: Shield, color: "#E50914", variant: "danger" },
};

const chiefLinks = [
  { href: "/admin/members", label: "الأعضاء", icon: Users, color: "#00E5FF" },
  { href: "/admin/tournaments", label: "البطولات", icon: Swords, color: "#8B5CF6" },
  { href: "/admin/events", label: "الفعاليات", icon: Calendar, color: "#00E676" },
  { href: "/admin/leaderboard", label: "الترتيب", icon: Award, color: "#FFD700" },
  { href: "/admin/requests", label: "طلبات الانضمام", icon: Users, color: "#8B5CF6" },
  { href: "/admin/support", label: "الدعم", icon: MessageSquare, color: "#FFD700" },
  { href: "/admin/instagram", label: "إنستغرام", icon: Camera, color: "#E1306C" },
];

const leaderLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, color: "#00E5FF" },
  { href: "/admin/members", label: "الأعضاء", icon: Users, color: "#00E5FF" },
  { href: "/admin/tournaments", label: "البطولات", icon: Swords, color: "#8B5CF6" },
  { href: "/admin/events", label: "الفعاليات", icon: Calendar, color: "#00E676" },
  { href: "/admin/support", label: "الدعم", icon: MessageSquare, color: "#FFD700" },
  { href: "/admin/orders", label: "الطلبات", icon: Award, color: "#FFD700" },
  { href: "/admin/gallery", label: "المعرض", icon: Camera, color: "#E1306C" },
  { href: "/admin/settings", label: "الإعدادات", icon: LayoutDashboard, color: "#8B5CF6" },
];

const roleIcons: Record<string, any> = { leader: Crown, vice: Star, chief: Shield };
const roleLabels: Record<string, string> = { leader: "قائد", vice: "شريك قائد", chief: "زعيم" };
const roleColors: Record<string, "gold" | "success" | "danger"> = { leader: "gold", vice: "success", chief: "danger" };

function DetailView({ person, isAdmin, onClose }: { person: any; isAdmin: boolean; onClose: () => void }) {
  if (!person) return null;
  const RoleIcon = roleIcons[person.role] || Crown;
  const links = (person.role === "leader" || person.role === "vice") ? leaderLinks : chiefLinks;

  return (
    <div className="animate-fade-slide-up">
      <button onClick={onClose} className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#00E5FF] transition-colors mb-4 border-0 bg-transparent cursor-pointer">
        <ArrowLeft size={16} /> العودة للقيادات
      </button>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className={`text-center py-10 relative overflow-hidden rounded-[18px] backdrop-blur-[20px] transition-all duration-300 border border-[rgba(255,255,255,0.10)] ${person.profileColor ? "" : "bg-[rgba(255,255,255,0.06)]"}`}
          style={person.profileColor ? { background: `linear-gradient(135deg, ${person.profileColor} 0%, ${person.profileColor}dd 100%)` } : undefined}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.06),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            {/* Avatar with Gold Frame + VIP */}
            <div className={`relative inline-block ${person.goldFrame ? "rounded-full p-[3px] bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]" : ""}`}>
              <div className="relative">
                <Avatar src={person.image || ""} name={person.name} size="xl" className="w-28 h-28 text-4xl ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-4 ring-offset-transparent rounded-full" />
                {person.vipBadge && (
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg">
                    <Crown size={14} className="text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg">
                  <RoleIcon size={16} className="text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black mb-1 mt-4" style={{ color: person.nameColor || "#FFFFFF" }}>{person.name}</h1>
            {person.gameId ? <p className="text-sm text-[#6B7280] mb-3">{person.gameId}</p> : null}
            <Badge variant={roleColors[person.role] || "default"} size="md" className="mb-3">{roleLabels[person.role] || person.role}</Badge>
            {person.bio ? <p className="text-sm text-[#9CA3AF] max-w-md mx-auto mb-4">{person.bio}</p> : null}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto mb-4">
              {person.level ? <div className="glass rounded-[14px] p-3 text-center"><p className="text-lg font-bold text-[#00E5FF]">{person.level}</p><p className="text-[10px] text-[#6B7280]">المستوى</p></div> : null}
              {person.wins ? <div className="glass rounded-[14px] p-3 text-center"><p className="text-lg font-bold text-[#FFD700]">{person.wins}</p><p className="text-[10px] text-[#6B7280]">فوز</p></div> : null}
              {person.country ? <div className="glass rounded-[14px] p-3 text-center"><p className="text-lg font-bold text-[#8B5CF6]">{person.country}</p><p className="text-[10px] text-[#6B7280]">البلد</p></div> : null}
              {person.age ? <div className="glass rounded-[14px] p-3 text-center"><p className="text-lg font-bold text-[#00E676]">{person.age}</p><p className="text-[10px] text-[#6B7280]">العمر</p></div> : null}
            </div>

            {person.playStyle ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[rgba(0,229,255,0.06)] text-sm text-[#9CA3AF] mb-4">
                <Gamepad2 size={14} className="text-[#00E5FF]" /> أسلوب اللعب: {person.playStyle}
              </div>
            ) : null}

            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {person.instagram ? (
                <a href={`https://instagram.com/${person.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-gradient-to-l from-[#E1306C] to-[#833AB4] text-white text-sm font-semibold hover:scale-105 transition-all no-underline shadow-lg"
                ><Camera size={16} /> @{person.instagram}</a>
              ) : null}
              {person.phone ? (
                <a href={`https://wa.me/${String(person.phone).replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#25D366] text-white text-sm font-semibold hover:scale-105 transition-all no-underline shadow-lg"
                ><Phone size={16} /> واتساب</a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {person.galleryImage ? (
          <div>
            <h2 className="text-lg font-bold mb-3">معرض الصور</h2>
            <img src={person.galleryImage} alt="" className="w-full rounded-[16px] object-cover max-h-64" />
          </div>
        ) : null}
        {Array.isArray(person.images) && person.images.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold mb-3">معرض الصور</h2>
            <div className="grid grid-cols-2 gap-3">
              {person.images.map((img: string, idx: number) => (
                <div key={idx} className="rounded-[14px] overflow-hidden aspect-video"><img src={img} alt="" className="w-full h-full object-cover" /></div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Admin Links */}
        {isAdmin ? (
          <div>
            <h2 className="text-lg font-bold mb-3">{person.role === "chief" ? "لوحة التحكم (صلاحيات محدودة)" : "لوحة التحكم الكاملة"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}
                    className="glass rounded-[14px] p-4 text-center hover:scale-[1.02] transition-all duration-300 no-underline group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${link.color}15` }}>
                      <Icon size={20} style={{ color: link.color }} />
                    </div>
                    <p className="text-xs font-semibold text-white">{link.label}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function LeadersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("dashboard_auth") === "true");
    api.getMembers().then(data => setMembers(data?.length ? data : fallback))
      .catch(() => setMembers(fallback))
      .finally(() => setLoading(false));
  }, []);

  const selected = members.find(m => m.id === selectedId) || null;

  const groups: Record<string, any[]> = { leader: [], vice: [], chief: [] };
  members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role)).forEach(l => {
    if (groups[l.role]) groups[l.role].push(l);
  });

  if (selected) {
    return (
      <PublicLayout>
        <DetailView person={selected} isAdmin={isAdmin} onClose={() => setSelectedId(null)} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">القيادات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">قادة وشركاء وزعماء SYRIA FOUR</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} className="animate-pulse p-8"><div className="h-6 w-24 rounded bg-[rgba(255,255,255,0.06)] mx-auto" /></GlassCard>
            ))}
          </div>
        ) : (
          Object.entries(roleData).map(([key, rd], si) => {
            const items = groups[key];
            if (!items?.length) return null;
            const Icon = rd.icon;
            return (
              <section key={key}>
                <div className="flex items-center gap-2 mb-4 animate-fade-slide-up" style={{ animationDelay: `${si * 0.1}s` }}>
                  <Icon size={22} style={{ color: rd.color }} />
                  <div>
                    <h2 className="text-lg font-bold">{rd.title}</h2>
                    <p className="text-xs text-[#9CA3AF]">{rd.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((l: any, i: number) => {
                    const RoleIcon = roleIcons[l.role] || Crown;
                    return (
                      <div key={l.id} className="animate-fade-slide-up cursor-pointer" style={{ animationDelay: `${i * 0.05 + si * 0.1}s` }}
                        onClick={() => setSelectedId(l.id)}
                      >
                        <GlassCard className="text-center py-8 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,229,255,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10">
                            <div className="relative inline-block">
                              <Avatar src={l.image || ""} name={l.name} size="xl" className="mx-auto mb-4 ring-2 ring-[rgba(0,229,255,0.1)] ring-offset-2 ring-offset-[#050816] rounded-full" />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg">
                                <RoleIcon size={12} className="text-white" />
                              </div>
                            </div>
                            <h3 className="font-bold text-lg">{l.name}</h3>
                            <Badge variant={rd.variant} size="sm" className="mt-2">{roleLabels[l.role] || l.role}</Badge>
                            {l.instagram && (
                              <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#E1306C]">
                                <Camera size={12} /> @{l.instagram}
                              </div>
                            )}
                          </div>
                        </GlassCard>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </PublicLayout>
  );
}
