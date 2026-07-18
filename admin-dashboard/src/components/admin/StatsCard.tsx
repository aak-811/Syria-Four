"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export default function StatsCard({ icon, label, value, color = "var(--primary)", className }: StatsCardProps) {
  return (
    <div className={cn("stats-card glass rounded-[18px] p-5", className)}>
      <div className="stats-glow" style={{ background: color }} />
      <div className="relative z-10 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}18` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-black tabular-nums" style={{ color }}>{value}</p>
          <p className="text-xs text-[var(--text-muted)]">{label}</p>
        </div>
      </div>
    </div>
  );
}
