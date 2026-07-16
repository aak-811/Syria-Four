"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Crown, Star, Shield } from "lucide-react";

const fallback = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, wins: 150, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AAK" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, wins: 120, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, wins: 200, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Za3im" },
];

const roleData: Record<string, { title: string; desc: string; icon: any; color: string; variant: "gold" | "success" | "danger" }> = {
  leader: { title: "القادة", desc: "قادة SYRIA FOUR الذين يقودون المسيرة", icon: Crown, color: "#FFD700", variant: "gold" },
  vice: { title: "شركاء القادة", desc: "شركاء القادة في SYRIA FOUR", icon: Star, color: "#00E676", variant: "success" },
  chief: { title: "الزعماء", desc: "زعماء SYRIA FOUR", icon: Shield, color: "#E50914", variant: "danger" },
};

export default function LeadersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMembers().then(data => setMembers(data?.length ? data : fallback))
      .catch(() => setMembers(fallback))
      .finally(() => setLoading(false));
  }, []);

  const groups: Record<string, any[]> = { leader: [], vice: [], chief: [] };
  members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role)).forEach(l => {
    if (groups[l.role]) groups[l.role].push(l);
  });

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
                  {items.map((l: any, i: number) => (
                    <Link key={l.id} href={`/leaders/${l.id}`} className="animate-fade-slide-up block no-underline" style={{ animationDelay: `${i * 0.05 + si * 0.1}s` }}>
                      <GlassCard className="text-center py-8 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Avatar src={l.image || ""} name={l.name} size="xl" className="mx-auto mb-4" />
                        <h3 className="font-bold text-lg">{l.name}</h3>
                        <Badge variant={rd.variant} size="sm" className="mt-2">{key === "leader" ? "قائد" : key === "vice" ? "شريك قائد" : "زعيم"}</Badge>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </PublicLayout>
  );
}
