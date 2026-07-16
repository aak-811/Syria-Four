"use client";

import Card from "@/components/ui/Card";
import { Users, Swords, Trophy, Eye } from "lucide-react";
import type { ReactNode } from "react";

function StatItem({ icon, value, label, color }: { icon: ReactNode; value: string; label: string; color: string }) {
  return (
    <Card className="text-center py-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${color}15` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-3xl md:text-4xl font-black tabular-nums">{value}</p>
      <p className="text-sm text-[var(--text-muted)] mt-1">{label}</p>
    </Card>
  );
}

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
      <StatItem icon={<Users size={28} />} value="120+" label="Members" color="var(--primary)" />
      <StatItem icon={<Swords size={28} />} value="15+" label="Tournaments" color="var(--secondary)" />
      <StatItem icon={<Trophy size={28} />} value="380+" label="Wins" color="var(--warning)" />
      <StatItem icon={<Eye size={28} />} value="40K+" label="Views" color="var(--success)" />
    </div>
  );
}
