"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "in-game";
  className?: string;
}

export default function Avatar({ src, alt = "", size = "md", status, className }: AvatarProps) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14", xl: "w-20 h-20" };
  const statusSizes = { sm: "w-2.5 h-2.5", md: "w-3 h-3", lg: "w-3.5 h-3.5", xl: "w-4 h-4" };
  const statusColors = {
    online: "bg-[#00E676]",
    offline: "bg-[#6B7280]",
    "in-game": "bg-[#E50914]",
  };

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.08)]",
          sizes[size]
        )}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[#0A0A0A]",
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
