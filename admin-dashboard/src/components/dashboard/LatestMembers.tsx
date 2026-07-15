"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
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
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    api.getMembers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const latestMembers = [...members]
    .sort((a, b) => new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime())
    .slice(0, 4);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">آخر الأعضاء</h3>
        <Link href="/members" className="flex items-center gap-1 text-sm text-[#E50914] font-semibold hover:underline">
          عرض الكل <ArrowRight size={16} />
        </Link>
      </div>
      <div className="space-y-3">
        {latestMembers.length === 0 ? (
          <p className="text-sm text-[#6B7280]">لا يوجد أعضاء بعد</p>
        ) : (
          latestMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex items-center gap-4 p-3 rounded-[14px] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
            >
              <Avatar src={member.avatar || member.image} size="lg" status={member.status === "active" ? "online" : "offline"} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-xs text-[#6B7280]">المعرف: {member.uid || member.gameId || "—"} · المستوى: {member.level || "—"}</p>
              </div>
              <Badge variant={roleColors[member.role] || "default"}>{member.role || "member"}</Badge>
            </motion.div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
