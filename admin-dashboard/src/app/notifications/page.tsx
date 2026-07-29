"use client";

import { useState, useEffect, useMemo } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Bell, Search, Filter, X, Pin, Clock, Calendar, ChevronDown } from "lucide-react";

const typeColors: Record<string, string> = {
  announcement: "#00E5FF", news: "#8B5CF6", tournament: "#FF6B35",
  member: "#00E676", leader: "#FFD700", gallery: "#FF6B35",
  video: "#E1306C", maintenance: "#F59E0B", warning: "#EF4444",
  error: "#DC2626", success: "#00E676", system: "#6B7280",
  promotion: "#FFD700", achievement: "#00E5FF", update: "#8B5CF6",
};

const typeLabels: Record<string, string> = {
  announcement: "إعلان", news: "أخبار", tournament: "بطولة",
  member: "عضو", leader: "قائد", gallery: "معرض",
  video: "فيديو", maintenance: "صيانة", warning: "تحذير",
  error: "خطأ", success: "نجاح", system: "نظام",
  promotion: "ترقية", achievement: "إنجاز", update: "تحديث",
};

const types = ["الكل", "announcement", "news", "tournament", "member", "promotion", "achievement", "update", "warning"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    api.getNotifications().then(data => {
      const list = Array.isArray(data) ? data : data?.notifications || [];
      setNotifications(list.filter((n: any) => n.category === "everyone" || n.category === "members" || !n.category));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...notifications];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => (n.title || "").toLowerCase().includes(q) || (n.message || "").toLowerCase().includes(q));
    }
    if (typeFilter !== "الكل") list = list.filter(n => n.type === typeFilter);
    return list;
  }, [notifications, search, typeFilter]);

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">الإشعارات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">آخر الإشعارات والتحديثات</p>
        </div>

        <GlassCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input placeholder="بحث في الإشعارات..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[12px] pr-10 pl-4 py-2.5 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-colors"
              />
              {search && <button onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white border-0 bg-transparent cursor-pointer"
              ><X size={14} /></button>}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all border-0 cursor-pointer ${
                    typeFilter === t ? "bg-[#00E5FF] text-[#050816]" : "glass text-[#9CA3AF] hover:text-white"
                  }`}
                >{typeLabels[t] || t}</button>
              ))}
            </div>
          </div>
        </GlassCard>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-[18px] p-5 animate-pulse">
                <div className="h-5 w-48 bg-[rgba(255,255,255,0.06)] rounded mb-2" />
                <div className="h-3 w-full bg-[rgba(255,255,255,0.04)] rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Bell size={48} className="mx-auto text-[#6B7280] mb-4" />
            <p className="text-[#9CA3AF]">لا توجد إشعارات</p>
          </GlassCard>
        )}

        {!loading && (
          <div className="space-y-3">
            {filtered.map((n, i) => (
              <div key={n.id} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <GlassCard className={`p-5 transition-all hover:bg-[rgba(255,255,255,0.06)] ${!n.isRead ? "border-r-2" : ""}`}
                  style={!n.isRead ? { borderRightColor: "#00E5FF" } : undefined}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${typeColors[n.type] || "#6B7280"}20`, color: typeColors[n.type] || "#6B7280" }}
                    ><Bell size={20} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${typeColors[n.type] || "#6B7280"}20`, color: typeColors[n.type] || "#6B7280" }}
                        >{typeLabels[n.type] || n.type}</span>
                        {n.isPinned && <Pin size={12} className="text-[#FFD700]" />}
                        {n.isRead === false && <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />}
                      </div>
                      <h3 className="font-bold text-base">{n.title}</h3>
                      {(n.message || n.description) && (
                        <p className="text-sm text-[#9CA3AF] mt-1 leading-relaxed">{n.message || n.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#6B7280]">
                        {n.createdAt && (
                          <span className="flex items-center gap-1"><Calendar size={12} />{new Date(n.createdAt).toLocaleDateString("ar-SA")}</span>
                        )}
                        {n.expiresAt && (
                          <span className="flex items-center gap-1"><Clock size={12} />ينتهي {new Date(n.expiresAt).toLocaleDateString("ar-SA")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
