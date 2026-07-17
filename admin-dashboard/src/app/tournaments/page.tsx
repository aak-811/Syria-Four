"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import CountdownTimer from "@/components/public/CountdownTimer";
import { api } from "@/lib/api";
import {
  Swords, Medal, Calendar, Users2, Gift, Clock,
  Map, Target, Trophy, Loader2, Send, CheckCircle, X
} from "lucide-react";

const typeNames: Record<string, string> = { previous: "سابقة", current: "جارية", upcoming: "قادمة" };

const fallback = [
  { id: "1", name: "بطولة SYRIA الموسمية", type: "current", description: "بطولة الموسم الحالي", startDate: "2026-07-01", endDate: "2026-08-01", mode: "5v5", maxPlayers: 100, prizeType: "ديموند", prizeValue: "5000", mapType: "بيرمودا", teamsCount: 16, logo: "", status: "جارية" },
  { id: "2", name: "كأس المحاربين", type: "upcoming", description: "بطولة المحاربين القادمة", startDate: "2026-08-15", endDate: "2026-09-15", mode: "4v4", maxPlayers: 64, prizeType: "عملة", prizeValue: "10000", mapType: "كالاهاري", teamsCount: 12, logo: "", status: "قادمة" },
  { id: "3", name: "بطولة الصيف", type: "previous", description: "بطولة الصيف الماضية", startDate: "2026-06-01", endDate: "2026-07-01", mode: "5v5", maxPlayers: 80, prizeType: "ديموند", prizeValue: "3000", mapType: "بيرمودا", teamsCount: 20, logo: "", status: "انتهت" },
];

const tabs = ["all", "previous", "current", "upcoming"];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", gameId: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.getTournaments().then(data => setTournaments(data?.length ? data : fallback))
      .catch(() => setTournaments(fallback))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === "all" ? tournaments : tournaments.filter(t => t.type === tab);

  const statusStyle = (type: string) => ({
    backgroundColor: type === "upcoming" ? "rgba(0,229,255,0.12)" :
      type === "current" ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.06)",
    color: type === "upcoming" ? "#00E5FF" :
      type === "current" ? "#00E676" : "#9CA3AF",
  });

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.gameId) return;
    setSending(true);
    try {
      await api.addRequest({ type: "tournament", tournamentName: selected?.name, ...form });
      setSent(true);
    } catch {
    } finally {
      setSending(false);
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">البطولات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">جميع بطولات SYRIA FOUR</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300 ${
                tab === t ? "bg-[#00E5FF] text-[#050816] shadow-[0_0_20px_rgba(0,229,255,0.3)]" : "glass text-[#9CA3AF] hover:text-white"
              }`}
            >{t === "all" ? "الكل" : typeNames[t] || t}</button>
          ))}
        </div>

        {loading && (
          <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => (
            <GlassCard key={i} className="animate-pulse p-6"><div className="h-6 w-48 rounded bg-[rgba(255,255,255,0.06)]" /></GlassCard>
          ))}</div>
        )}

        {!loading && filtered.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Swords size={48} className="mx-auto text-[#6B7280] mb-4" />
            <p className="text-[#9CA3AF]">لا توجد بطولات</p>
          </GlassCard>
        )}

        {!loading && (
          <div className="grid gap-4">
            {filtered.map((t, i) => (
              <div key={t.id || i} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <GlassCard hover onClick={() => setSelected(t)} className="relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(139,92,246,0.03)] rounded-full blur-[50px]" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Image/Logo */}
                    <div className="w-full md:w-24 h-24 rounded-[16px] overflow-hidden shrink-0 bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
                      {t.logo ? (
                        <img src={t.logo} alt="" className="w-full h-full object-cover" />
                      ) : t.image ? (
                        <img src={t.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Medal size={32} className="text-[#8B5CF6]" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="min-w-0">
                        <h3 className="font-bold text-base">{t.name}</h3>
                        {t.description && <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{t.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold" style={statusStyle(t.type)}>
                            {typeNames[t.type] || t.type}
                          </span>
                          {t.mode && <span className="text-[11px] text-[#6B7280]">{t.mode}</span>}
                          {t.mapType && <span className="text-[11px] text-[#6B7280]">| {t.mapType}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                      {t.type !== "previous" && t.startDate && (
                        <span className="flex items-center gap-1.5 bg-[rgba(0,229,255,0.06)] rounded-[10px] px-3 py-1.5 border border-[rgba(0,229,255,0.08)]">
                          <Clock size={12} className="text-[#00E5FF]" />
                          <CountdownTimer targetDate={t.startDate} />
                        </span>
                      )}
                      {t.teamsCount && (
                        <span className="flex items-center gap-1 bg-[rgba(139,92,246,0.06)] rounded-[10px] px-3 py-1.5">
                          <Users2 size={14} className="text-[#8B5CF6]" /> {t.teamsCount} فريق
                        </span>
                      )}
                      {(t.prizeValue || t.prizeType) && (
                        <span className="flex items-center gap-1 bg-[rgba(255,215,0,0.06)] rounded-[10px] px-3 py-1.5">
                          <Gift size={14} className="text-[#FFD700]" /> {t.prizeValue} {t.prizeType}
                        </span>
                      )}
                      {t.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} className="text-[#9CA3AF]" /> {new Date(t.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        )}

        <Modal open={!!selected} onClose={() => { setSelected(null); setShowForm(false); setSent(false); }} title="" className="max-w-2xl">
          {selected && !showForm && (
            <div className="space-y-4">
              {/* Banner Image */}
              {(selected.image || selected.logo) ? (
                <div className="w-full h-48 rounded-[16px] overflow-hidden bg-[rgba(139,92,246,0.1)]">
                  <img src={selected.image || selected.logo} alt={selected.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 rounded-[16px] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(0,229,255,0.1)] flex items-center justify-center">
                  <Medal size={64} className="text-[#8B5CF6] opacity-40" />
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold inline-block mt-1" style={statusStyle(selected.type)}>
                    {typeNames[selected.type] || selected.type}
                  </span>
                </div>
                {selected.type !== "previous" && (
                  <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] bg-gradient-to-l from-[#00E5FF] to-[#8B5CF6] text-white text-sm font-semibold hover:scale-[1.02] transition-all border-0 cursor-pointer"
                  >
                    <Target size={16} /> انضمام
                  </button>
                )}
              </div>

              {selected.description && <p className="text-sm text-[#9CA3AF]">{selected.description}</p>}

              {selected.type !== "previous" && selected.startDate && (
                <GlassCard className="text-center p-4">
                  <p className="text-xs text-[#6B7280] mb-2">العد التنازلي</p>
                  <span className="text-lg font-bold text-[#00E5FF]"><CountdownTimer targetDate={selected.startDate} /></span>
                </GlassCard>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "تاريخ البداية", value: selected.startDate ? new Date(selected.startDate).toLocaleDateString() : "—", icon: Calendar },
                  { label: "تاريخ النهاية", value: selected.endDate ? new Date(selected.endDate).toLocaleDateString() : "—", icon: Calendar },
                  { label: "الوضع", value: selected.mode || "—", icon: Swords },
                  { label: "الخريطة", value: selected.mapType || "—", icon: Map },
                  { label: "الحد الأقصى", value: selected.maxPlayers || "—", icon: Users2 },
                  { label: "عدد الفرق", value: selected.teamsCount || "—", icon: Trophy },
                  { label: "الجائزة", value: selected.prizeType || "—", icon: Gift },
                  { label: "القيمة", value: selected.prizeValue || "—", icon: Medal },
                ].map((f, idx) => {
                  const Icon = f.icon;
                  return f.value ? (
                    <div key={idx} className="glass rounded-[14px] p-3 text-right">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={12} className="text-[#6B7280]" />
                        <p className="text-[10px] text-[#6B7280]">{f.label}</p>
                      </div>
                      <p className="text-sm font-semibold">{f.value}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Join Form */}
          {selected && showForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">انضمام إلى {selected.name}</h2>
                <button onClick={() => { setShowForm(false); setSent(false); }}
                  className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors border-0 cursor-pointer"
                ><X size={16} /></button>
              </div>
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-[#00E676] mb-4" />
                  <p className="font-semibold">تم إرسال طلب الانضمام!</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">سيتم التواصل معك قريباً.</p>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-4">
                  <input placeholder="الاسم داخل اللعبة" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all"
                  />
                  <input placeholder="معرف اللعبة (UID)" value={form.gameId} onChange={e => setForm(p => ({ ...p, gameId: e.target.value }))} required
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all"
                  />
                  <input placeholder="رقم واتساب (اختياري)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-all"
                  />
                  <button type="submit" disabled={sending}
                    className="w-full py-3 rounded-[14px] bg-gradient-to-l from-[#00E5FF] to-[#8B5CF6] text-white font-semibold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                  >{sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} إرسال الطلب</button>
                </form>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PublicLayout>
  );
}
