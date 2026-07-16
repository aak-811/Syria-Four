import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="glass rounded-[18px] p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-dim)]">
        {icon}
      </div>
      <p className="text-lg font-semibold">{title}</p>
      {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
    </div>
  );
}
