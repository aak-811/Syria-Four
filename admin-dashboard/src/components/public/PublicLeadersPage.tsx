"use client";

import { useState, useEffect } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Crown, Star, Shield, Camera } from "lucide-react";

const roleNames: Record<string, string> = { leader: "قائد", vice: "شريك قائد", chief: "زعيم" };
const roleIcons: Record<string, typeof Crown> = { leader: Crown, vice: Star, chief: Shield };
const roleColors: Record<string, string> = { leader: "#FFD700", vice: "#00E676", chief: "#E50914" };

const fallbackMembers = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, country: "SY", wins: 150, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AAK" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, country: "SY", wins: 120, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, country: "SY", wins: 200, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Za3im" },
];

export default function PublicLeadersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMembers().then(data => {
      setMembers(data && data.length > 0 ? data : fallbackMembers);
    }).catch(() => {
      setMembers(fallbackMembers);
    }).finally(() => setLoading(false));
  }, []);

  const groups: Record<string, any[]> = { leader: [], vice: [], chief: [] };
  members.filter(m => m.role && ["leader", "vice", "chief"].includes(m.role)).forEach(l => {
    if (groups[l.role]) groups[l.role].push(l);
  });

  const sections = [
    { key: "leader", title: "القادة", desc: "قادة SYRIA FOUR الذين يقودون المسيرة" },
    { key: "vice", title: "شركاء القادة", desc: "شركاء القادة في SYRIA FOUR" },
    { key: "chief", title: "الزعماء", desc: "زعماء SYRIA FOUR" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">القيادات</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">قادة وشركاء وزعماء SYRIA FOUR</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[rgba(0,229,255,0.2)] border-t-[#00E5FF] rounded-full animate-spin" />
        </div>
      )}

      {!loading && sections.map((sec, si) => {
        const items = groups[sec.key] || [];
        if (items.length === 0) return null;
        const Icon = roleIcons[sec.key] || Crown;
        return (
          <div key={sec.key}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon size={22} style={{ color: roleColors[sec.key] }} /> {sec.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((l: any, i: number) => (
                <div key={l.id} className="fade-in" style={{ animationDelay: `${i * 0.05 + si * 0.1}s` }}>
                  <GlassCard className="text-center py-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Avatar src={l.image || ""} name={l.name} size="xl" className="mx-auto mb-4" />
                    <h3 className="font-bold text-lg">{l.name}</h3>
                    <Badge variant={sec.key === "leader" ? "gold" : sec.key === "vice" ? "success" : "danger"} size="sm" className="mt-2">{roleNames[sec.key]}</Badge>
                    {l.instagram && (
                      <a href={`https://instagram.com/${l.instagram}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 text-sm text-[#9CA3AF] hover:text-[#E50914] transition-colors mt-3"
                      ><Camera size={14} /> @{l.instagram}</a>
                    )}
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
