"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { MEMBERS_DATA } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger",
  chief: "gold",
  vice: "info",
  elite: "success",
  member: "default",
};

export default function LatestMembers() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Latest Members</h3>
        <Link href="/members" className="flex items-center gap-1 text-sm text-[#E50914] font-semibold hover:underline">
          View All <ArrowRight size={16} />
        </Link>
      </div>
      <div className="space-y-3">
        {MEMBERS_DATA.slice(0, 4).map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-center gap-4 p-3 rounded-[14px] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
          >
            <Avatar src={member.avatar} size="lg" status={member.status === "active" ? "online" : "offline"} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-[#6B7280]">UID: {member.uid} · {member.rank}</p>
            </div>
            <Badge variant={roleColors[member.role]}>{member.role}</Badge>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
