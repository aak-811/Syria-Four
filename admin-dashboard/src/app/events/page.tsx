"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Clock, Flame, Crosshair } from "lucide-react";

const iconMap: Record<string, any> = { clock: Clock, fire: Flame, war: Crosshair };

const fallback = [
  { id: "1", title: "حدث تدريبي", description: "تدريبات مكثفة للاستعداد للبطولة القادمة", icon: "clock", createdAt: "2026-07-10" },
  { id: "2", title: "حفل تكريم", description: "تكريم الفائزين في بطولة الصيف", icon: "fire", createdAt: "2026-07-05" },
  { id: "3", title: "مباراة ودية", description: "مباراة ودية مع كلان النخبة", icon: "war", createdAt: "2026-06-28" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents().then(data => setEvents(data.length > 0 ? data : fallback))
      .catch(() => setEvents(fallback))
      .finally(() => setLoading(false));
  }, []);

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
                  <GlassCard>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-[rgba(255,215,0,0.12)] flex items-center justify-center shrink-0">
                        <Icon size={22} className="text-[#FFD700]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold">{e.title}</h3>
                        {e.description && <p className="text-sm text-[#9CA3AF] mt-0.5">{e.description}</p>}
                        {e.createdAt && <span className="text-[11px] text-[#6B7280]">{new Date(e.createdAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
