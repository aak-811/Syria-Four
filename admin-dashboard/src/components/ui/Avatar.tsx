import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" };

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initial = (name || "?").charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name || ""}
        className={cn("rounded-full object-cover shrink-0", sizes[size], className)}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  return (
    <div className={cn(
      "rounded-full shrink-0 flex items-center justify-center font-bold bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]",
      sizes[size], className
    )}>
      {initial}
    </div>
  );
}
