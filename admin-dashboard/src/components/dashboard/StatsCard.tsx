"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  Users, Activity, Swords, Trophy, TrendingUp, TrendingDown,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={24} />,
  Activity: <Activity size={24} />,
  Swords: <Swords size={24} />,
  Trophy: <Trophy size={24} />,
};

interface StatsCardProps {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  delay?: number;
}

function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const numeric = parseFloat(value.replace(/[^0-9.-]/g, ""));
  const suffix = value.replace(/[0-9.,-]/g, "");
  const isDecimal = value.includes(".");

  useEffect(() => {
    if (isNaN(numeric)) { setDisplay(value); return; }
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      setDisplay((isDecimal ? current.toFixed(1) : Math.floor(current).toString()) + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsCard({ label, value, change, icon, color, delay = 0 }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard hover className="relative overflow-hidden group">
        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
        />

        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: `${color}15` }}>
            <span style={{ color }}>{iconMap[icon]}</span>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold",
            isPositive ? "bg-[rgba(0,230,118,0.1)] text-[#00E676]" : "bg-[rgba(255,59,48,0.1)] text-[#FF3B30]"
          )}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </div>
        </div>

        <p className="text-2xl font-black tracking-tight mb-1">
          <AnimatedCounter value={value} />
        </p>
        <p className="text-sm text-[#9CA3AF] font-medium">{label}</p>
      </GlassCard>
    </motion.div>
  );
}
