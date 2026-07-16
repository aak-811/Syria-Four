"use client";

import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

const roleData: Record<string, { label: string; variant: "gold" | "success" | "danger" }> = {
  leader: { label: "قائد", variant: "gold" },
  vice: { label: "شريك قائد", variant: "success" },
  chief: { label: "زعيم", variant: "danger" },
};

interface LeaderCardProps {
  leader: any;
}

export default function LeaderCard({ leader }: LeaderCardProps) {
  const info = roleData[leader.role] || { label: leader.role, variant: "default" as const };

  return (
    <Card className="text-center py-8 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--danger)] via-[#FF6B35] to-[var(--warning)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <Avatar src={leader.image || ""} name={leader.name} size="xl" className="mx-auto mb-4" />
      <h3 className="font-bold text-lg">{leader.name}</h3>
      <Badge variant={info.variant} size="sm" className="mt-2">{info.label}</Badge>
    </Card>
  );
}
