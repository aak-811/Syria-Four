"use client";

import { useState, useEffect } from "react";
import { X, Bell, Pin } from "lucide-react";
import { api } from "@/lib/api";

const typeColors: Record<string, string> = {
  announcement: "#00E5FF", news: "#8B5CF6", tournament: "#FF6B35",
  member: "#00E676", warning: "#EF4444", error: "#DC2626",
  success: "#00E676", system: "#6B7280", maintenance: "#F59E0B",
};

export default function BannerNotification() {
  const [pinned, setPinned] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.getNotifications().then(data => {
      const list = Array.isArray(data) ? data : data?.notifications || [];
      setPinned(list.filter((n: any) => n.isPinned && n.status !== "expired" && n.status !== "archived"));
    }).catch(() => {});
  }, []);

  const visible = pinned.filter(n => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visible.map((n) => (
        <div key={n.id}
          className="flex items-center gap-3 px-5 py-3 rounded-[14px] border animate-fade-slide-up"
          style={{
            backgroundColor: `${typeColors[n.type] || "#6B7280"}12`,
            borderColor: `${typeColors[n.type] || "#6B7280"}30`,
          }}
        >
          <Pin size={14} style={{ color: typeColors[n.type] || "#6B7280" }} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{n.title}</p>
            {(n.message || n.description) && (
              <p className="text-xs text-[var(--text-dim)] truncate">{n.message || n.description}</p>
            )}
          </div>
          <button onClick={() => setDismissed(prev => new Set(prev).add(n.id))}
            className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:text-white transition-all border-0 bg-transparent cursor-pointer shrink-0"
          ><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
