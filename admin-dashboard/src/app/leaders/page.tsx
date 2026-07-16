"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import LeaderCard from "@/components/public/LeaderCard";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { Crown, Star, Shield } from "lucide-react";

const fallback = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, wins: 150 },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, wins: 120 },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, wins: 200 },
];

const roleData: Record<string, { title: string; desc: string; icon: any; color: string }> = {
  leader: { title: "القادة", desc: "قادة SYRIA FOUR الذين يقودون المسيرة", icon: Crown, color: "var(--warning)" },
  vice: { title: "شركاء القادة", desc: "شركاء القادة في SYRIA FOUR", icon: Star, color: "var(--success)" },
  chief: { title: "الزعماء", desc: "زعماء SYRIA FOUR", icon: Shield, color: "var(--danger)" },
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
    <div className="min-h-screen bg-[var(--bg)]">
      <PublicNavbar />
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black">القيادات</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">قادة وشركاء وزعماء SYRIA FOUR</p>
          </div>

          {loading ? <Spinner /> : (
            Object.entries(roleData).map(([key, rd]) => {
              const items = groups[key];
              if (!items?.length) return null;
              const Icon = rd.icon;
              return (
                <section key={key}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={22} style={{ color: rd.color }} />
                    <div>
                      <h2 className="text-lg font-bold">{rd.title}</h2>
                      <p className="text-xs text-[var(--text-muted)]">{rd.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(l => <LeaderCard key={l.id} leader={l} />)}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
