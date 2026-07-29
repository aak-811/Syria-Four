"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Bell, Check, Pin, ExternalLink, Dot } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

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

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      api.getNotifications().then(data => {
        const list = Array.isArray(data) ? data : data?.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter((n: any) => !n.isRead).length);
      }).catch(() => {});
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    try { await api.markAsRead(id); setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n)); setUnreadCount(c => Math.max(0, c - 1)); } catch {}
  };

  const handleMarkAllRead = async () => {
    try { await api.markAllAsRead(); setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); setUnreadCount(0); } catch {}
  };

  const timeAgo = (date: string) => {
    if (!date) return "";
    const now = Date.now();
    const d = new Date(date).getTime();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} س`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} ي`;
    return new Date(date).toLocaleDateString("ar-SA");
  };

  return (
    <div className="fixed top-0 left-0 right-0 lg:right-[260px] h-[70px] border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl z-20 flex items-center px-4 md:px-6 gap-4">
      <button onClick={onToggleSidebar}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[10px] glass glass-hover"
      ><Menu size={20} /></button>
      <div className="flex-1" />

      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative w-10 h-10 flex items-center justify-center rounded-[10px] glass glass-hover border-0 cursor-pointer"
        >
          <Bell size={18} className="text-[var(--text-muted)]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[var(--danger)] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-[380px] max-h-[520px] z-50 bg-[rgba(5,8,22,0.98)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[18px] shadow-2xl overflow-hidden animate-fade-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
              <h3 className="font-bold text-sm">الإشعارات</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead}
                    className="text-[10px] text-[var(--primary)] hover:underline bg-transparent border-0 cursor-pointer"
                  >تعليم الكل مقروء</button>
                )}
                <Link href="/admin/notifications" onClick={() => setDropdownOpen(false)}
                  className="text-[10px] text-[var(--text-muted)] hover:text-white no-underline"
                >عرض الكل</Link>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[420px]">
              {notifications.length === 0 && (
                <div className="p-8 text-center text-sm text-[var(--text-dim)]">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  لا توجد إشعارات
                </div>
              )}

              {notifications.slice(0, 30).map((n) => (
                <div key={n.id}
                  className={`flex items-start gap-3 p-4 border-b border-[rgba(255,255,255,0.03)] transition-all hover:bg-[rgba(255,255,255,0.03)] ${!n.isRead ? "bg-[rgba(0,229,255,0.03)]" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${typeColors[n.type] || "#6B7280"}20`, color: typeColors[n.type] || "#6B7280" }}
                  >
                    <Bell size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${typeColors[n.type] || "#6B7280"}20`, color: typeColors[n.type] || "#6B7280" }}>
                        {typeLabels[n.type] || n.type}
                      </span>
                      {n.isPinned && <Pin size={10} className="text-[#FFD700]" />}
                      {!n.isRead && <Dot size={16} className="text-[var(--primary)] shrink-0" />}
                    </div>
                    <p className="text-sm font-semibold truncate">{n.title || "بدون عنوان"}</p>
                    <p className="text-xs text-[var(--text-dim)] truncate">{n.message || n.description || ""}</p>
                    <p className="text-[10px] text-[var(--text-dim)] mt-1">{timeAgo(n.createdAt || n.date)}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {!n.isRead && (
                      <button onClick={() => handleMarkRead(n.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(0,229,255,0.1)] text-[var(--text-dim)] hover:text-[var(--primary)] transition-all border-0 bg-transparent cursor-pointer"
                        title="تعليم كمقروء"
                      ><Check size={14} /></button>
                    )}
                    <Link href={`/admin/notifications`} onClick={() => setDropdownOpen(false)}
                      className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:text-white transition-all no-underline"
                    ><ExternalLink size={14} /></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
