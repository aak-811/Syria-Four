"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "in-game";
  className?: string;
}

export default function Avatar({ src, alt = "", name, size = "md", status, className }: AvatarProps) {
  const [error, setError] = useState(false);
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg", xl: "w-20 h-20 text-2xl" };
  const statusSizes = { sm: "w-2.5 h-2.5", md: "w-3 h-3", lg: "w-3.5 h-3.5", xl: "w-4 h-4" };
  const statusColors = {
    online: "bg-[#00E676]",
    offline: "bg-[#6B7280]",
    "in-game": "bg-[#00E5FF]",
  };

  const initials = name
    ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const showImage = src && !error;

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.08)] flex items-center justify-center",
          "bg-gradient-to-br from-[rgba(0,229,255,0.15)] to-[rgba(139,92,246,0.15)]",
          "font-bold text-white",
          sizes[size]
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <span className="select-none">{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[#050816]",
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
