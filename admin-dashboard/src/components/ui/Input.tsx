"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            "block text-sm font-semibold mb-2 transition-colors duration-300",
            focused ? "text-[#E50914]" : "text-[#9CA3AF]"
          )}>{label}</label>
        )}
        <div className="relative group">
          {icon && (
            <div className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
              focused ? "text-[#E50914]" : "text-[#6B7280]"
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-[14px] px-4 py-3 text-white outline-none transition-all duration-400",
              "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(255,255,255,0.12)]",
              "placeholder:text-[#6B7280] placeholder:transition-colors placeholder:duration-300",
              "hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.18)]",
              "focus:bg-[rgba(229,9,20,0.06)] focus:border-[#E50914] focus:shadow-[0_0_20px_rgba(229,9,20,0.15),0_0_40px_rgba(229,9,20,0.05)]",
              "focus:placeholder:text-[#9CA3AF]",
              icon && "pr-12",
              error && "border-[#FF3B30] focus:border-[#FF3B30] focus:shadow-[0_0_20px_rgba(255,59,48,0.15)]",
              className
            )}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            {...props}
          />
          <div className={cn(
            "absolute inset-0 rounded-[14px] pointer-events-none transition-opacity duration-500",
            "bg-gradient-to-l from-transparent via-transparent to-[rgba(229,9,20,0.03)]",
            focused ? "opacity-100" : "opacity-0"
          )} />
        </div>
        {error && <p className="text-[#FF3B30] text-xs mt-1.5 flex items-center gap-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
