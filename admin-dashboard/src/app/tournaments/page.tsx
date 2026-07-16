"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import TournamentCard from "@/components/public/TournamentCard";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import CountdownTimer from "@/components/public/CountdownTimer";
import { api } from "@/lib/api";
import { Swords, Medal } from "lucide-react";

const fallback = [
  { id: "1", name: "بطولة SYRIA الموسمية", type: "current", description: "بطولة الموسم الحالي", mode: "5v5", startDate: "2026-07-01", endDate: "2026-08-01", prizeValue: "5000", prizeType: "ديموند", teamsCount: 16, maxPlayers: 100, mapType: "بيرمودا" },
  { id: "2", name: "كأس المحاربين", type: "upcoming", description: "بطولة المحاربين القادمة", mode: "4v4", startDate: "2026-08-15", endDate: "2026-09-15", prizeValue: "10000", prizeType: "عملة", teamsCount: 12 },
];

const typeNames: Record<string, string> = { previous: "سابقة", current: "جارية", upcoming: "قادمة" };
const tabs = ["all", "previous", "current", "upcoming"];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getTournaments().then(data => setTournaments(data?.length ? data : fallback))
      .catch(() => setTournaments(fallback))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === "all" ? tournaments : tournaments.filter(t => t.type === tab);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PublicNavbar />
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black">البطولات</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">جميع بطولات SYRIA FOUR</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-200 ${tab === t ? "bg-[var(--primary)] text-[var(--bg)]" : "glass text-[var(--text-muted)] hover:text-white"}`}
              >{t === "all" ? "الكل" : typeNames[t] || t}</button>
            ))}
          </div>

          {loading ? <Spinner /> : filtered.length === 0 ? (
            <EmptyState icon={<Swords size={32} />} title="لا توجد بطولات" />
          ) : (
            <div className="grid gap-4">
              {filtered.map(t => (
                <TournamentCard key={t.id} tournament={t} onClick={() => setSelected(t)} />
              ))}
            </div>
          )}

          <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
            {selected && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-[14px] bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
                    <Medal size={24} className="text-[var(--secondary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold">{selected.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: selected.type === "upcoming" ? "rgba(0,229,255,0.12)" : selected.type === "current" ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.06)",
                        color: selected.type === "upcoming" ? "var(--primary)" : selected.type === "current" ? "var(--success)" : "var(--text-muted)",
                      }}
                    >{typeNames[selected.type] || selected.type}</span>
                  </div>
                </div>
                {selected.description && <p className="text-sm text-[var(--text-muted)]">{selected.description}</p>}
                {selected.type !== "previous" && selected.startDate && (
                  <Card className="text-center py-4">
                    <p className="text-xs text-[var(--text-dim)] mb-2">العد التنازلي</p>
                    <span className="text-lg font-bold text-[var(--primary)]"><CountdownTimer targetDate={selected.startDate} /></span>
                  </Card>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "تاريخ البداية", value: selected.startDate ? new Date(selected.startDate).toLocaleDateString() : "—" },
                    { label: "تاريخ النهاية", value: selected.endDate ? new Date(selected.endDate).toLocaleDateString() : "—" },
                    { label: "الوضع", value: selected.mode || "—" },
                    { label: "الخريطة", value: selected.mapType || "—" },
                    { label: "الحد الأقصى", value: selected.maxPlayers || "—" },
                    { label: "عدد الفرق", value: selected.teamsCount || "—" },
                    { label: "الجائزة", value: selected.prizeType || "—" },
                    { label: "قيمة الجائزة", value: selected.prizeValue || "—" },
                  ].map(f => (
                    <div key={f.label} className="glass rounded-[14px] p-3">
                      <p className="text-[10px] text-[var(--text-dim)]">{f.label}</p>
                      <p className="text-sm font-semibold mt-0.5">{f.value}</p>
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
