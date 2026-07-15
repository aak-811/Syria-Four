"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, glow, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-[14px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary: "bg-[#E50914] text-white hover:bg-[#B00812] active:scale-[0.97]",
      secondary: "bg-[#FFD700] text-black hover:bg-[#E6C200] active:scale-[0.97]",
      ghost: "glass text-white hover:bg-[rgba(255,255,255,0.1)]",
      danger: "bg-[#FF3B30] text-white hover:bg-[#D32F2F] active:scale-[0.97]",
      success: "bg-[#00E676] text-black hover:bg-[#00C853] active:scale-[0.97]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          glow && "animate-pulse-glow",
          className
        )}
        {...(props as any)}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
