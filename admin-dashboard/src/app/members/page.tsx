"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import MemberCard from "@/components/public/MemberCard";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { Users, Search } from "lucide-react";

const fallback = [
  { id: "1", name: "AAK Khalid", gameId: "AAK-1234", role: "leader", level: 80, wins: 150, tournaments: 25, country: "SY" },
  { id: "2", name: "Qusai", gameId: "Qusai-5678", role: "vice", level: 75, wins: 120, tournaments: 18, country: "SY" },
  { id: "3", name: "Za3im", gameId: "Za3im-9012", role: "chief", level: 85, wins: 200, tournaments: 30, country: "SY" },
];

const roles = ["all", "leader", "chief", "vice", "elite", "member"];

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getMembers().then(data => setMembers(data?.length ? data : fallback))
      .catch(() => setMembers(fallback))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (!q || m.name?.toLowerCase().includes(q) || m.gameId?.toLowerCase().includes(q)) &&
      (roleFilter === "all" || m.role === roleFilter);
  });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PublicNavbar />
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black">الأعضاء</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">جميع أعضاء كلان SYRIA FOUR</p>
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
                  <input
                    placeholder="البحث بالاسم أو معرف اللعبة..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] pr-10 pl-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {roles.map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-4 py-2 rounded-[12px] text-xs font-semibold transition-all duration-200 ${roleFilter === r ? "bg-[var(--primary)] text-[var(--bg)]" : "glass text-[var(--text-muted)] hover:text-white"}`}
                  >{r === "all" ? "الكل" : r === "leader" ? "قائد" : r === "chief" ? "زعيم" : r === "vice" ? "نائب" : r === "elite" ? "نخبة" : "عضو"}</button>
                ))}
              </div>
            </div>
          </Card>

          {loading ? <Spinner /> : filtered.length === 0 ? (
            <EmptyState icon={<Users size={32} />} title="لا يوجد أعضاء" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(m => (
                <MemberCard key={m.id} member={m} onClick={() => setSelected(m)} />
              ))}
            </div>
          )}

          <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
            {selected && (
              <div className="text-center">
                <Avatar src={selected.image || ""} name={selected.name} size="xl" className="mx-auto mb-4 ring-2 ring-[rgba(0,229,255,0.15)] ring-offset-2 ring-offset-[#050816] rounded-full" />
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="text-sm text-[var(--text-muted)]">{selected.gameId}</p>
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {selected.role && <Badge variant={selected.role === "leader" ? "danger" : selected.role === "chief" ? "gold" : selected.role === "vice" ? "info" : selected.role === "elite" ? "success" : "default"}>{selected.role === "leader" ? "قائد" : selected.role === "vice" ? "نائب" : selected.role === "chief" ? "زعيم" : selected.role === "elite" ? "نخبة" : "عضو"}</Badge>}
                  {selected.country && <Badge variant="default">{selected.country}</Badge>}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { label: "البطولات", value: selected.tournaments || 0, color: "var(--primary)" },
                    { label: "المستوى", value: selected.level || "—", color: "var(--secondary)" },
                    { label: "فوز", value: selected.wins || 0, color: "var(--warning)" },
                  ].map(f => (
                    <div key={f.label} className="glass rounded-[14px] p-3">
                      <p className="text-lg font-bold" style={{ color: f.color }}>{f.value}</p>
                      <p className="text-[10px] text-[var(--text-dim)]">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
