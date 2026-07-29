"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Dot, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

const typeColors: Record<string, string> = {
  announcement: "#00E5FF", news: "#8B5CF6", tournament: "#FF6B35",
  member: "#00E676", leader: "#FFD700", gallery: "#FF6B35",
  video: "#E1306C", success: "#00E676", promotion: "#FFD700",
  achievement: "#00E5FF", update: "#8B5CF6", warning: "#EF4444",
};

const typeLabels: Record<string, string> = {
  announcement: "إعلان", news: "أخبار", tournament: "بطولة",
  member: "عضو", promotion: "ترقية", achievement: "إنجاز",
  update: "تحديث", success: "نجاح", warning: "تحذير",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      api.getNotifications().then(data => {
        const list = Array.isArray(data) ? data : data?.notifications || [];
        const publicList = list.filter((n: any) => n.category === "everyone" || n.category === "members" || !n.category);
        setNotifications(publicList);
        setUnreadCount(publicList.filter((n: any) => !n.isRead).length);
      }).catch(() => {});
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const timeAgo = (date: string) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} س`;
    return new Date(date).toLocaleDateString("ar-SA");
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-[14px] glass glass-hover border-0 cursor-pointer"
      >
        <Bell size={16} className="text-[var(--text-muted)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--danger)] text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[340px] max-h-[460px] z-50 bg-[rgba(5,8,22,0.98)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[18px] shadow-2xl overflow-hidden animate-fade-slide-up">
          <div className="flex items-center justify-between p-3 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="font-bold text-sm">الإشعارات</h3>
            <Link href="/notifications" onClick={() => setOpen(false)}
              className="text-[10px] text-[var(--primary)] hover:underline no-underline"
            >عرض الكل</Link>
          </div>
          <div className="overflow-y-auto max-h-[380px]">
            {notifications.length === 0 && (
              <div className="p-6 text-center text-sm text-[var(--text-dim)]">لا توجد إشعارات</div>
            )}
            {notifications.slice(0, 20).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-3 border-b border-[rgba(255,255,255,0.03)] ${!n.isRead ? "bg-[rgba(0,229,255,0.03)]" : ""}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${typeColors[n.type] || "#6B7280"}20`, color: typeColors[n.type] || "#6B7280" }}
                ><Bell size={14} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{n.title || "بدون عنوان"}</p>
                  <p className="text-[11px] text-[var(--text-dim)] truncate">{n.message || n.description || ""}</p>
                  <p className="text-[9px] text-[var(--text-dim)] mt-0.5">{timeAgo(n.createdAt || n.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
