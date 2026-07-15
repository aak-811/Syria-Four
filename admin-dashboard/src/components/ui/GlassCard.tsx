"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode, MouseEventHandler } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "red" | "gold" | "none";
  hover?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
}

export default function GlassCard({ children, className, glow = "none", hover, onClick, onDragOver, onDragLeave, onDrop }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "rounded-[18px] p-6 transition-all duration-300",
        "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)]",
        "hover:bg-[rgba(255,255,255,0.09)] hover:border-[rgba(255,255,255,0.15)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]",
        "backdrop-blur-[20px]",
        glow === "red" && "glow-red",
        glow === "gold" && "glow-gold",
        hover && "cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    />
  );
}
