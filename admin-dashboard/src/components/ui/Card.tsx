"use client";

import { cn } from "@/lib/utils";
import type { ReactNode, MouseEventHandler } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

export default function Card({ children, className, hover, glow, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "glass rounded-[18px] p-6 glass-hover",
        glow && "shadow-[0_0_30px_rgba(0,229,255,0.1)]",
        (hover || onClick) && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
