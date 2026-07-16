import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "gold" | "info";
  size?: "sm" | "md";
  className?: string;
}

const colors: Record<string, string> = {
  default: "bg-[rgba(255,255,255,0.06)] text-[var(--text-muted)]",
  primary: "bg-[rgba(0,229,255,0.12)] text-[var(--primary)]",
  success: "bg-[rgba(0,230,118,0.12)] text-[var(--success)]",
  warning: "bg-[rgba(255,215,0,0.12)] text-[var(--warning)]",
  danger: "bg-[rgba(229,9,20,0.12)] text-[var(--danger)]",
  gold: "bg-[rgba(255,215,0,0.15)] text-yellow-300",
  info: "bg-[rgba(139,92,246,0.12)] text-[var(--secondary)]",
};

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-block rounded-full font-semibold",
      size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
      colors[variant],
      className
    )}>
      {children}
    </span>
  );
}
