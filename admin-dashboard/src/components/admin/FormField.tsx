"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormInput({ label, className, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
      <input
        className={cn(
          "w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors duration-200",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function FormTextarea({ label, className, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
      <textarea
        className={cn(
          "w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors duration-200 resize-none",
          className
        )}
        {...props}
      />
    </div>
  );
}
