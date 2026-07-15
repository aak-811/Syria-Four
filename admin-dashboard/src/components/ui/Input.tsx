"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white placeholder:text-[#6B7280] transition-all duration-300 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] focus:bg-[rgba(229,9,20,0.05)]",
              icon && "pr-12",
              error && "border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[#FF3B30] text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
