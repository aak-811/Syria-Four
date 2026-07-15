"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { NOTIFICATIONS_DATA } from "@/lib/data";
import { cn, timeAgo } from "@/lib/utils";
import { Bell, CheckCheck, Send, Trash2, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

const typeConfig = {
  success: { icon: CheckCircle, color: "#00E676", bg: "rgba(0,230,118,0.1)" },
  warning: { icon: AlertTriangle, color: "#FFC107", bg: "rgba(255,193,7,0.1)" },
  info: { icon: Info, color: "#E50914", bg: "rgba(229,9,20,0.1)" },
  error: { icon: XCircle, color: "#FF3B30", bg: "rgba(255,59,48,0.1)" },
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? NOTIFICATIONS_DATA : activeTab === "unread" ? NOTIFICATIONS_DATA.filter(n => !n.read) : NOTIFICATIONS_DATA.filter(n => n.read);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Notifications</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Stay updated with clan activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm"><CheckCheck size={16} /> Mark All Read</Button>
          <Button variant="primary" glow size="sm"><Send size={16} /> Send Notification</Button>
        </div>
      </motion.div>

      <GlassCard className="p-2">
        <div className="flex gap-1">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300",
                activeTab === tab.id ? "bg-[#E50914] text-white" : "text-[#6B7280] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-2">
        {filtered.map((n, i) => {
          const config = typeConfig[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard
                hover
                className={cn(
                  "flex items-start gap-4",
                  !n.read && "border-l-2 border-l-[#E50914]"
                )}
              >
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: config.bg }}>
                  <config.icon size={20} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#E50914]" />}
                  </div>
                  <p className="text-sm text-[#9CA3AF]">{n.message}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-full">
                  <Trash2 size={16} className="text-[#6B7280]" />
                </button>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
