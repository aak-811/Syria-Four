"use client";

import { useState, useEffect } from "react";
import { chatApi } from "@/lib/chat-api";
import { MessageCircle, MessageSquare, FileText, Users, RefreshCw } from "lucide-react";

export default function AdminChatPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await chatApi.getChatStats();
      setStats(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadStats(); }, []);

  const cards = [
    { label: "المحادثات", value: stats?.totalConversations || 0, icon: MessageCircle, color: "#00E5FF" },
    { label: "الرسائل", value: stats?.totalMessages || 0, icon: MessageSquare, color: "#8B5CF6" },
    { label: "الملفات", value: stats?.totalFiles || 0, icon: FileText, color: "#FFD700" },
    { label: "متصلون الآن", value: stats?.onlineUsers || 0, icon: Users, color: "#00E676" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black gradient-text">إحصائيات الدردشة</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">نظرة عامة على نظام المحادثات</p>
        </div>
        <button onClick={loadStats} disabled={loading} className="px-4 py-2 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="stats-card glass rounded-[16px] p-5">
            <div className="stats-glow" style={{ background: card.color, opacity: 0.06 }} />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-2xl font-black">{loading ? "..." : card.value.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
