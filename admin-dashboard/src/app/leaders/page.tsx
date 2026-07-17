"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Crown, Star, Shield, ArrowLeft, Camera, Globe, Users, Swords, Calendar, MessageSquare, LayoutDashboard, X, ExternalLink, Mail, Phone } from "lucide-react";

const fallback = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, wins: 150, image: "", instagram: "aak.811", country: "SY" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, wins: 120, image: "", instagram: "qusai7r", country: "SY" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, wins: 200, image: "", instagram: "", country: "SY" },
];

const roleData: Record<string, { title: string; desc: string; icon: any; color: string; variant: "gold" | "success" | "danger" }> = {
  leader: { title: "القادة", desc: "قادة SYRIA FOUR الذين يقودون المسيرة", icon: Crown, color: "#FFD700", variant: "gold" },
  vice: { title: "شركاء القادة", desc: "شركاء القادة في SYRIA FOUR", icon: Star, color: "#00E676", variant: "success" },
  chief: { title: "الزعماء", desc: "زعماء SYRIA FOUR", icon: Shield, color: "#E50914", variant: "danger" },
};

const dashboardLinks: Record<string, { href: string; label: string; icon: any; color: string }[]> = {
  leader: [
    { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, color: "#00E5FF" },
    { href: "/admin/members", label: "الأعضاء", icon: Users, color: "#00E5FF" },
    { href: "/admin/tournaments", label: "البطولات", icon: Swords, color: "#8B5CF6" },
    { href: "/admin/events", label: "الفعاليات", icon: Calendar, color: "#00E676" },
    { href: "/admin/support", label: "الدعم", icon: MessageSquare, color: "#FFD700" },
  ],
  vice: [
    { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, color: "#00E5FF" },
    { href: "/admin/members", label: "الأعضاء", icon: Users, color: "#00E5FF" },
    { href: "/admin/tournaments", label: "البطولات", icon: Swords, color: "#8B5CF6" },
    { href: "/admin/events", label: "الفعاليات", icon: Calendar, color: "#00E676" },
    { href: "/admin/support", label: "الدعم", icon: MessageSquare, color: "#FFD700" },
  ],
  chief: [
    { href: "/admin/members", label: "الأعضاء", icon: Users, color: "#00E5FF" },
    { href: "/admin/tournaments", label: "البطولات", icon: Swords, color: "#8B5CF6" },
    { href: "/admin/events", label: "الفعاليات", icon: Calendar, color: "#00E676" },
    { href: "/admin/support", label: "الدعم", icon: MessageSquare, color: "#FFD700" },
  ],
};

const roleIcons: Record<string, any> = { leader: Crown, vice: Star, chief: Shield };
const roleLabels: Record<string, string> = { leader: "قائد", vice: "شريك قائد", chief: "زعيم" };
const roleColors: Record<string, "gold" | "success" | "danger"> = { leader: "gold", vice: "success", chief: "danger" };

export default function LeadersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const selectedId = searchParams.get("id");
  const selected = members.find(m => m.id === selectedId) || null;

  useEffect(() => {
    setIsAdmin(localStorage.getItem("dashboard_auth") === "true");
    api.getMembers().then(data => setMembers(data?.length ? data : fallback))
      .catch(() => setMembers(fallback))
      .finally(() => setLoading(false));
  }, []);

  const groups: Record<string, any[]> = { leader: [], vice: [], chief: [] };
  members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role)).forEach(l => {
    if (groups[l.role]) groups[l.role].push(l);
  });

  const openDetail = (id: string) => router.push(`/leaders?id=${id}`);
  const closeDetail = () => router.push("/leaders");

  return (
    <PublicLayout>
      <div className="space-y-6">
        {selected ? (
          /* Leader Detail View */
          <div className="animate-fade-slide-up">
            <button onClick={closeDetail} className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#00E5FF] transition-colors mb-4">
              <ArrowLeft size={16} /> العودة للقيادات
            </button>
            <div className="max-w-3xl mx-auto space-y-6">
              <GlassCard className="text-center py-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.03)] via-transparent to-[rgba(139,92,246,0.03)] pointer-events-none" />
                <div className="relative z-10">
                  <div className="relative inline-block">
                    <Avatar src={selected.image || ""} name={selected.name} size="xl" className="w-24 h-24 text-3xl mx-auto mb-5 ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-4 ring-offset-[#050816] rounded-full" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg">
                      {(roleIcons[selected.role] || Crown)({ size: 16, className: "text-white" })}
                    </div>
                  </div>
                  <h1 className="text-3xl font-black mb-1">{selected.name}</h1>
                  {selected.gameId && <p className="text-sm text-[#6B7280] mb-3">{selected.gameId}</p>}
                  <Badge variant={roleColors[selected.role] || "default"} size="md" className="mb-4">
                    {roleLabels[selected.role] || selected.role}
                  </Badge>
                  <div className="flex items-center justify-center gap-6 flex-wrap text-sm mb-4">
                    {selected.level && (
                      <div className="text-center">
                        <p className="text-xl font-bold text-[#00E5FF]">{selected.level}</p>
                        <p className="text-[10px] text-[#6B7280]">المستوى</p>
                      </div>
                    )}
                    {selected.wins && (
                      <div className="text-center">
                        <p className="text-xl font-bold text-[#FFD700]">{selected.wins}</p>
                        <p className="text-[10px] text-[#6B7280]">فوز</p>
                      </div>
                    )}
                    {selected.country && (
                      <div className="text-center">
                        <p className="text-xl font-bold text-[#8B5CF6]">{selected.country}</p>
                        <p className="text-[10px] text-[#6B7280]">البلد</p>
                      </div>
                    )}
                  </div>
                  {selected.bio && <p className="text-sm text-[#9CA3AF] max-w-md mx-auto">{selected.bio}</p>}

                  {/* Social Media Buttons */}
                  <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                    {selected.instagram && (
                      <a href={`https://instagram.com/${selected.instagram}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-gradient-to-l from-[#E1306C] to-[#833AB4] text-white text-sm font-semibold hover:scale-105 transition-all no-underline shadow-lg"
                      >
                        <Camera size={16} /> @{selected.instagram}
                      </a>
                    )}
                    {selected.phone && (
                      <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#25D366] text-white text-sm font-semibold hover:scale-105 transition-all no-underline shadow-lg"
                      >
                        <Phone size={16} /> واتساب
                      </a>
                    )}
                    {selected.email && (
                      <a href={`mailto:${selected.email}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[rgba(255,215,0,0.12)] text-[#FFD700] text-sm font-semibold hover:scale-105 transition-all no-underline shadow-lg border border-[rgba(255,215,0,0.2)]"
                      >
                        <Mail size={16} /> بريد
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>

              {isAdmin && (
                <div>
                  <h2 className="text-lg font-bold mb-3">لوحة التحكم</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(dashboardLinks[selected.role] || dashboardLinks.leader).map((link) => {
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
              )}
            </div>
          </div>
        ) : (
          /* Leaders List View */
          <>
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
                            onClick={() => openDetail(l.id)}
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
          </>
        )}
      </div>
    </PublicLayout>
  );
}
