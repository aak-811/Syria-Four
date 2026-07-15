"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { UserPlus } from "lucide-react";

export default function ActivityTimeline() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    api.getMembers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime())
    .slice(0, 10);

  return (
    <GlassCard>
      <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
      <div className="space-y-1">
        {recentMembers.length === 0 ? (
          <p className="text-sm text-[#6B7280] p-3">No recent activity</p>
        ) : (
          recentMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-[14px] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
            >
              <div className="relative">
                <Avatar src={member.avatar || member.image} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] bg-[#00E676]">
                  <UserPlus size={14} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">
                  <span className="text-white">{member.name}</span>{" "}
                  <span className="text-[#9CA3AF] font-normal">joined the clan</span>
                </p>
                <p className="text-xs text-[#6B7280]">{timeAgo(member.joinDate)}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            </motion.div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
