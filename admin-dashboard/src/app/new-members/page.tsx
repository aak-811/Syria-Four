"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import {
  Users, MapPin, Search, Filter, Clock,
  UserPlus, TrendingUp, Globe, ChevronDown,
  X, Loader2
} from "lucide-react";

const MembersMap = dynamic(() => import("@/components/public/MembersMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] md:min-h-[550px] rounded-[20px] bg-[rgba(255,255,255,0.02)] animate-pulse flex items-center justify-center">
      <Loader2 size={32} className="text-[#00E5FF] animate-spin" />
    </div>
  ),
});

const governorates = [
  "الكل", "دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "الحسكة", "الرقة", "دير الزور", "ريف دمشق", "إدلب",
  "السعودية", "الإمارات", "مصر", "العراق", "الأردن", "لبنان",
  "فلسطين", "قطر", "البحرين", "الكويت", "عمان", "اليمن",
];

const fallbackMembers = [
  { id: "1", name: "AAK Khalid", role: "leader", level: 80, wins: 150, country: "SY", image: "", joinDate: "2024-01-15", isOnline: true, goldFrame: true, vipBadge: true, nameColor: "#FFD700" },
  { id: "2", name: "Qusai", role: "vice", level: 75, wins: 120, country: "SY", image: "", joinDate: "2024-02-20", isOnline: true, goldFrame: true, vipBadge: true, nameColor: "#00E5FF" },
  { id: "3", name: "Za3im", role: "chief", level: 85, wins: 200, country: "SY", image: "", joinDate: "2024-03-10", isOnline: false, goldFrame: false, vipBadge: false, nameColor: "#8B5CF6" },
  { id: "4", name: "Sniper", role: "elite", level: 70, wins: 95, country: "SA", image: "", joinDate: "2025-05-01", isOnline: true },
  { id: "5", name: "Shadow", role: "member", level: 60, wins: 50, country: "AE", image: "", joinDate: "2025-06-12", isOnline: false },
  { id: "6", name: "Phoenix", role: "member", level: 55, wins: 40, country: "EG", image: "", joinDate: "2025-07-01", isOnline: true },
  { id: "7", name: "Fury", role: "member", level: 65, wins: 78, country: "IQ", image: "", joinDate: "2025-07-05", isOnline: false },
  { id: "8", name: "Viper", role: "member", level: 50, wins: 35, country: "JO", image: "", joinDate: "2025-07-10", isOnline: true },
  { id: "9", name: "Storm", role: "elite", level: 72, wins: 110, country: "LB", image: "", joinDate: "2025-07-15", isOnline: false },
  { id: "10", name: "Thunder", role: "member", level: 45, wins: 28, country: "QA", image: "", joinDate: "2025-07-18", isOnline: true },
  { id: "11", name: "Blade", role: "member", level: 58, wins: 62, country: "KW", image: "", joinDate: "2025-07-20", isOnline: false },
  { id: "12", name: "Ghost", role: "member", level: 62, wins: 55, country: "OM", image: "", joinDate: "2025-07-22", isOnline: true },
];

export default function NewMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [govFilter, setGovFilter] = useState("الكل");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showGovDropdown, setShowGovDropdown] = useState(false);
  const govRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getMembers()
      .then(data => setMembers(data?.length ? data : fallbackMembers))
      .catch(() => setMembers(fallbackMembers))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (govRef.current && !govRef.current.contains(e.target as Node)) {
        setShowGovDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const stats = useMemo(() => {
    const total = members.length;
    const newToday = members.filter(m => m.joinDate === today).length;
    const newThisWeek = members.filter(m => m.joinDate && m.joinDate >= weekAgo).length;
    return { total, newToday, newThisWeek };
  }, [members, today, weekAgo]);

  const filteredMembers = useMemo(() => {
    let list = [...members];
    const q = search.toLowerCase();
    if (q) list = list.filter(m => m.name?.toLowerCase().includes(q) || m.gameId?.toLowerCase().includes(q));
    if (onlineOnly) list = list.filter(m => m.isOnline);
    return list;
  }, [members, search, onlineOnly]);

  const mapMembers = useMemo(() => {
    return filteredMembers.map(m => ({
      ...m,
      joinDate: m.joinDate || "2024-01-01",
      isOnline: m.isOnline ?? Math.random() > 0.4,
    }));
  }, [filteredMembers]);

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">أحدث الأعضاء</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">اكتشف أحدث المنضمين لكلان SYRIA FOUR حول العالم</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Stats & Filters */}
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: UserPlus, value: stats.newToday, label: "اليوم", color: "#00E5FF" },
                { icon: TrendingUp, value: stats.newThisWeek, label: "هذا الأسبوع", color: "#8B5CF6" },
                { icon: Globe, value: stats.total, label: "الإجمالي", color: "#FFD700" },
              ].map((s, i) => (
                <GlassCard key={i} className="text-center py-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <s.icon size={18} className="mx-auto mb-1" style={{ color: s.color }} />
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[10px] text-[#6B7280]">{s.label}</p>
                </GlassCard>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                placeholder="بحث بالاسم..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] pr-10 pl-4 py-3 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#00E5FF] transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
                ><X size={14} /></button>
              )}
            </div>

            {/* Governorate Filter */}
            <div className="relative" ref={govRef}>
              <button onClick={() => setShowGovDropdown(!showGovDropdown)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-sm text-right flex items-center justify-between text-white cursor-pointer hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#00E5FF]" />
                  {govFilter === "الكل" ? "جميع المناطق" : govFilter}
                </span>
                <ChevronDown size={14} className={`text-[#6B7280] transition-transform ${showGovDropdown ? "rotate-180" : ""}`} />
              </button>
              {showGovDropdown && (
                <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[rgba(5,8,22,0.98)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[14px] p-2 shadow-xl max-h-60 overflow-y-auto">
                  {governorates.map(g => (
                    <button key={g} onClick={() => { setGovFilter(g); setShowGovDropdown(false); }}
                      className={`w-full text-right px-3 py-2 rounded-[10px] text-sm transition-all cursor-pointer border-0 ${
                        g === govFilter ? "bg-[rgba(0,229,255,0.1)] text-[#00E5FF]" : "text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                      }`}
                    >{g}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Online Only Toggle */}
            <button onClick={() => setOnlineOnly(!onlineOnly)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-sm transition-all cursor-pointer border-0 ${
                onlineOnly
                  ? "bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.2)]"
                  : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${onlineOnly ? "bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.5)]" : "bg-[#6B7280]"}`} />
                المتصلين فقط
              </span>
              <span className={`w-10 h-5 rounded-full transition-colors ${onlineOnly ? "bg-[#00E676]" : "bg-[rgba(255,255,255,0.12)]"}`}>
                <span className={`block w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${onlineOnly ? "translate-x-5" : "translate-x-0.5"}`} />
              </span>
            </button>

            {/* Members List Preview */}
            <div className="space-y-2">
              <p className="text-xs text-[#6B7280] px-1">
                {filteredMembers.length} عضو
                {onlineOnly ? " متصل" : ""}
                {search ? ` مطابق للبحث` : ""}
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-hide">
                {filteredMembers.slice(0, 20).map((m, i) => (
                  <div key={m.id}
                    onMouseEnter={() => setHoveredId(m.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex items-center gap-3 p-2.5 rounded-[12px] transition-all duration-200 cursor-pointer ${
                      hoveredId === m.id
                        ? "bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.15)]"
                        : "bg-[rgba(255,255,255,0.02)] border border-transparent hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    <div className="relative">
                      <Avatar src={m.image || ""} name={m.name} size="sm" className="w-9 h-9 text-xs rounded-full" />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#050816] ${
                        m.isOnline ? "bg-[#00E676]" : "bg-[#6B7280]"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: m.nameColor || "#fff" }}>{m.name}</p>
                      <p className="text-[10px] text-[#6B7280]">{m.joinDate}</p>
                    </div>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      m.role === "leader" ? "bg-[rgba(0,229,255,0.12)] text-[#00E5FF]" :
                      m.role === "vice" ? "bg-[rgba(139,92,246,0.12)] text-[#8B5CF6]" :
                      m.role === "chief" ? "bg-[rgba(255,215,0,0.12)] text-[#FFD700]" :
                      "bg-[rgba(255,255,255,0.06)] text-[#9CA3AF]"
                    }`}>
                      {m.role === "leader" ? "قائد" : m.role === "vice" ? "نائب" : m.role === "chief" ? "زعيم" : m.role || "عضو"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <GlassCard className="p-2 md:p-3 overflow-hidden">
              <MembersMap
                members={mapMembers}
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            </GlassCard>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
