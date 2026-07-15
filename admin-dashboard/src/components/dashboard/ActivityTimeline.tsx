"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { ACTIVITY_DATA } from "@/lib/data";
import { timeAgo, cn } from "@/lib/utils";
import { Swords, UserPlus, Crown, Newspaper, Zap } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  member: <UserPlus size={14} />,
  tournament: <Swords size={14} />,
  news: <Newspaper size={14} />,
  system: <Zap size={14} />,
};

const typeColors: Record<string, string> = {
  member: "#00E676",
  tournament: "#FFD700",
  news: "#E50914",
  system: "#FFC107",
};

export default function ActivityTimeline() {
  return (
    <GlassCard>
      <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
      <div className="space-y-1">
        {ACTIVITY_DATA.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-[14px] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
          >
            <div className="relative">
              <Avatar src={item.avatar} size="md" />
              <div
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A]"
                style={{ background: typeColors[item.type] }}
              >
                {typeIcons[item.type]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                <span className="text-white">{item.user}</span>{" "}
                <span className="text-[#9CA3AF] font-normal">{item.action}</span>
              </p>
              <p className="text-xs text-[#6B7280]">{timeAgo(item.timestamp)}</p>
            </div>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              item.type === "member" && "bg-[#00E676]",
              item.type === "tournament" && "bg-[#FFD700]",
              item.type === "news" && "bg-[#E50914]",
              item.type === "system" && "bg-[#FFC107]",
            )} />
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
