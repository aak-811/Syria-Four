"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import CountdownTimer from "@/components/public/CountdownTimer";
import { api } from "@/lib/api";
import {
  Clock, Flame, Crosshair, Gift, Users2, Calendar,
  Target, Send, Loader2, CheckCircle, X, Medal, Star
} from "lucide-react";

const iconMap: Record<string, any> = { clock: Clock, fire: Flame, war: Crosshair };

const fallback = [
  { id: "1", title: "حدث تدريبي", description: "تدريبات مكثفة للاستعداد للبطولة القادمة", icon: "clock", createdAt: "2026-07-10", image: "", prize: "500 ديموند", maxPlayers: 20, startDate: "2026-07-15" },
  { id: "2", title: "حفل تكريم", description: "تكريم الفائزين في بطولة الصيف", icon: "fire", createdAt: "2026-07-05", image: "", prize: "1000 ديموند", maxPlayers: 50, startDate: "2026-07-20" },
  { id: "3", title: "مباراة ودية", description: "مباراة ودية مع كلان النخبة", icon: "war", createdAt: "2026-06-28", image: "", prize: "", maxPlayers: 10, startDate: "2026-07-10" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", gameId: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.getEvents().then(data => setEvents(data.length > 0 ? data : fallback))
      .catch(() => setEvents(fallback))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.gameId) return;
    setSending(true);
    try {
      await api.addRequest({ type: "event", eventName: selected?.title, ...form });
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
          <h1 className="text-2xl font-black">الفعاليات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">فعاليات وأنشطة SYRIA FOUR</p>
        </div>

        {loading ? (
          <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => (
            <GlassCard key={i} className="animate-pulse p-6"><div /></GlassCard>
          ))}</div>
        ) : events.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Flame size={48} className="mx-auto text-[#6B7280] mb-4" />
            <p className="text-[#9CA3AF]">لا توجد فعاليات</p>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {events.map((e, i) => {
              const Icon = iconMap[e.icon] || Clock;
              return (
                <div key={e.id || i} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <GlassCard hover onClick={() => { setSelected(e); setShowForm(false); setSent(false); }} className="cursor-pointer relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      {e.image ? (
                        <div className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0 bg-[rgba(255,215,0,0.1)]">
                          <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-[14px] bg-[rgba(255,215,0,0.12)] flex items-center justify-center shrink-0">
                          <Icon size={22} className="text-[#FFD700]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold">{e.title}</h3>
                        {e.description && <p className="text-sm text-[#9CA3AF] mt-0.5 line-clamp-1">{e.description}</p>}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {e.createdAt && <span className="text-[11px] text-[#6B7280]">{new Date(e.createdAt).toLocaleDateString()}</span>}
                          {e.prize && <span className="text-[11px] text-[#FFD700] flex items-center gap-1"><Gift size={10} /> {e.prize}</span>}
                          {e.maxPlayers && <span className="text-[11px] text-[#8B5CF6] flex items-center gap-1"><Users2 size={10} /> {e.maxPlayers}</span>}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}

        <Modal open={!!selected} onClose={() => { setSelected(null); setShowForm(false); setSent(false); }} title="" className="max-w-2xl">
          {selected && !showForm && (() => {
            const Icon = iconMap[selected.icon] || Clock;
            return (
              <div className="space-y-4">
                {selected.image ? (
                  <div className="w-full h-48 rounded-[16px] overflow-hidden bg-[rgba(255,215,0,0.1)]">
                    <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-[16px] bg-gradient-to-br from-[rgba(255,215,0,0.12)] to-[rgba(255,107,53,0.08)] flex items-center justify-center">
                    <Icon size={64} className="text-[#FFD700] opacity-40" />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{selected.title}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[rgba(255,215,0,0.12)] text-[#FFD700] font-semibold inline-block mt-1">فعالية</span>
                  </div>
                  <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black font-semibold text-sm hover:scale-[1.02] transition-all border-0 cursor-pointer"
                  >
                    <Target size={16} /> انضمام
                  </button>
                </div>

                {selected.description && <p className="text-sm text-[#9CA3AF]">{selected.description}</p>}

                {selected.startDate && (
                  <GlassCard className="text-center p-4">
                    <p className="text-xs text-[#6B7280] mb-2">العد التنازلي</p>
                    <span className="text-lg font-bold text-[#FFD700]"><CountdownTimer targetDate={selected.startDate} /></span>
                  </GlassCard>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "تاريخ الفعالية", value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "—", icon: Calendar },
                    { label: "تاريخ البدء", value: selected.startDate ? new Date(selected.startDate).toLocaleDateString() : "—", icon: Calendar },
                    { label: "المكافأة", value: selected.prize || "—", icon: Gift },
                    { label: "الحد الأقصى", value: selected.maxPlayers ? `${selected.maxPlayers} مشارك` : "—", icon: Users2 },
                  ].map((f, idx) => {
                    const FIcon = f.icon;
                    return f.value ? (
                      <div key={idx} className="glass rounded-[14px] p-3 text-right">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FIcon size={12} className="text-[#6B7280]" />
                          <p className="text-[10px] text-[#6B7280]">{f.label}</p>
                        </div>
                        <p className="text-sm font-semibold">{f.value}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })()}

          {selected && showForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">انضمام إلى {selected.title}</h2>
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
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#FFD700] transition-all"
                  />
                  <input placeholder="معرف اللعبة (UID)" value={form.gameId} onChange={e => setForm(p => ({ ...p, gameId: e.target.value }))} required
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#FFD700] transition-all"
                  />
                  <input placeholder="رقم واتساب (اختياري)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#FFD700] transition-all"
                  />
                  <button type="submit" disabled={sending}
                    className="w-full py-3 rounded-[14px] bg-gradient-to-l from-[#FFD700] to-[#FF6B35] text-black font-semibold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
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
