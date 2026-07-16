"use client";

import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export default function Button({ variant = "primary", size = "md", loading, children, className, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" };
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--bg)] hover:brightness-110",
    secondary: "glass glass-hover text-white",
    danger: "bg-[var(--danger)] text-white hover:brightness-110",
    ghost: "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], loading && "cursor-wait", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
