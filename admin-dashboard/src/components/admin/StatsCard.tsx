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
    <div className={cn("glass rounded-[18px] p-5", className)}>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-black tabular-nums">{value}</p>
          <p className="text-xs text-[var(--text-muted)]">{label}</p>
        </div>
      </div>
    </div>
  );
}
