"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { ArrowLeft, Users, Swords, Calendar, MessageSquare, LayoutDashboard, Crown, Shield, Star } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const roleLabels: Record<string, string> = { leader: "قائد", vice: "شريك قائد", chief: "زعيم", elite: "نخبة", member: "عضو" };
const roleColors: Record<string, "gold" | "success" | "danger"> = { leader: "gold", vice: "success", chief: "danger" };

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

export default function LeaderDetailClient({ params }: Props) {
  const [leader, setLeader] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id: resolvedId }) => setId(resolvedId));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setIsAdmin(localStorage.getItem("dashboard_auth") === "true");
    api.getMembers().then(data => {
      const found = data.find((m: any) => m.id === id);
      if (found) setLeader(found);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading || !id) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-[rgba(0,229,255,0.2)] border-t-[#00E5FF] rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (!leader) {
    return (
      <PublicLayout>
        <div className="text-center py-32">
          <p className="text-[#9CA3AF] text-lg">لم يتم العثور على القائد</p>
          <Link href="/leaders" className="inline-flex items-center gap-2 mt-4 text-[#00E5FF] hover:underline">
            <ArrowLeft size={16} /> العودة للقيادات
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const RoleIcon = roleIcons[leader.role] || Crown;

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/leaders" className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#00E5FF] transition-colors no-underline">
          <ArrowLeft size={16} /> العودة للقيادات
        </Link>

        <GlassCard className="text-center py-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700]" />
          <Avatar src={leader.image || ""} name={leader.name} size="xl" className="w-20 h-20 text-2xl mx-auto mb-5 ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-4 ring-offset-[#050816] rounded-full" />
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto -mt-8 mb-3 bg-[rgba(0,229,255,0.1)]">
            <RoleIcon size={24} className="text-[#00E5FF]" />
          </div>
          <h1 className="text-3xl font-black mb-1">{leader.name}</h1>
          {leader.gameId && <p className="text-sm text-[#6B7280] mb-3">{leader.gameId}</p>}
          <Badge variant={roleColors[leader.role] || "default"} size="md" className="mb-4">
            {roleLabels[leader.role] || leader.role}
          </Badge>

          <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
            {leader.level && (
              <div className="text-center">
                <p className="text-xl font-bold text-[#00E5FF]">{leader.level}</p>
                <p className="text-[10px] text-[#6B7280]">المستوى</p>
              </div>
            )}
            {leader.wins && (
              <div className="text-center">
                <p className="text-xl font-bold text-[#FFD700]">{leader.wins}</p>
                <p className="text-[10px] text-[#6B7280]">فوز</p>
              </div>
            )}
            {leader.country && (
              <div className="text-center">
                <p className="text-xl font-bold text-[#8B5CF6]">{leader.country}</p>
                <p className="text-[10px] text-[#6B7280]">البلد</p>
              </div>
            )}
          </div>

          {leader.bio && (
            <p className="text-sm text-[#9CA3AF] mt-4 max-w-md mx-auto">{leader.bio}</p>
          )}
        </GlassCard>

        {isAdmin && (
          <div>
            <h2 className="text-lg font-bold mb-3">لوحة التحكم</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(dashboardLinks[leader.role] || dashboardLinks.leader).map((link) => {
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
    </PublicLayout>
  );
}
