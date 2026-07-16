import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-6 h-6 border-2", md: "w-10 h-10 border-3", lg: "w-14 h-14 border-4" };

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <div className={cn(
        "rounded-full border-[rgba(0,229,255,0.2)] border-t-[var(--primary)] animate-spin",
        sizes[size]
      )} />
    </div>
  );
}
