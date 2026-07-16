"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Crown, Star, Shield, Camera } from "lucide-react";

const roleNames: Record<string, string> = { leader: "قائد", vice: "شريك قائد", chief: "زعيم" };
const roleIcons: Record<string, typeof Crown> = { leader: Crown, vice: Star, chief: Shield };
const roleColors: Record<string, string> = { leader: "#FFD700", vice: "#00E676", chief: "#E50914" };

export default function PublicLeadersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('[LEADERS_PAGE] RENDER: loading =', loading, 'members.length =', members.length);

  const fallbackMembers = [
    { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, country: "SY", wins: 150, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AAK" },
    { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, country: "SY", wins: 120, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai" },
    { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, country: "SY", wins: 200, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Za3im" },
  ];

  useEffect(() => {
    console.log('[LEADERS_PAGE] useEffect START...');
    api.getMembers().then(data => {
      console.log('[LEADERS_PAGE] .then() data length:', data?.length);
      const final = data && data.length > 0 ? data : fallbackMembers;
      setMembers(final);
    }).catch(err => {
      console.error('[LEADERS_PAGE] .catch():', err);
      setMembers(fallbackMembers);
    }).finally(() => {
      console.log('[LEADERS_PAGE] .finally() - loading=false');
      setLoading(false);
    });
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
    <>
      <div style={{ background: 'red', color: 'white', padding: '20px', fontSize: '40px', textAlign: 'center', position: 'relative', zIndex: 9999 }}>
        LEADERS CONTENT — loading=false ✓
      </div>
      <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">القيادات</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">قادة وشركاء وزعماء SYRIA FOUR</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <GlassCard key={i} className="animate-pulse p-8"><div className="h-6 w-24 rounded bg-[rgba(255,255,255,0.06)] mx-auto" /></GlassCard>
          ))}
        </div>
      ) : (
        sections.map((sec, si) => {
          const items = groups[sec.key] || [];
          if (items.length === 0) return null;
          const Icon = roleIcons[sec.key] || Crown;
          return (
            <div key={sec.key}>
              <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.1 }}
                className="text-lg font-bold mb-4 flex items-center gap-2"
              ><Icon size={22} style={{ color: roleColors[sec.key] }} /> {sec.title}</motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((l: any, i: number) => (
                  <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + si * 0.1 }}>
                    <GlassCard className="text-center py-8 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Avatar src={l.image || ""} name={l.name} size="xl" className="mx-auto mb-4" />
                      <h3 className="font-bold text-lg">{l.name}</h3>
                      <Badge variant={sec.key === "leader" ? "gold" : sec.key === "vice" ? "success" : "danger"} size="sm" className="mt-2">{roleNames[sec.key]}</Badge>
                      {l.instagram && (
                        <a href={`https://instagram.com/${l.instagram}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 text-sm text-[#9CA3AF] hover:text-[#E50914] transition-colors mt-3"
                        >                      <Camera size={14} /> @{l.instagram}</a>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
    </>
  );
}
