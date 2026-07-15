"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export default function Badge({ variant = "default", children, className, size = "sm" }: BadgeProps) {
  const variants = {
    default: "bg-[rgba(255,255,255,0.08)] text-[#9CA3AF]",
    success: "bg-[rgba(0,230,118,0.12)] text-[#00E676]",
    warning: "bg-[rgba(255,193,7,0.12)] text-[#FFC107]",
    danger: "bg-[rgba(255,59,48,0.12)] text-[#FF3B30]",
    info: "bg-[rgba(229,9,20,0.12)] text-[#E50914]",
    gold: "bg-[rgba(255,215,0,0.12)] text-[#FFD700]",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-3 py-1.5 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        "bg-current": variant !== "default",
        "bg-[#9CA3AF]": variant === "default",
      })} />
      {children}
    </span>
  );
}
