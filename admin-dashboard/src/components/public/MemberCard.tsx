"use client";

import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger", chief: "gold", vice: "info", elite: "success", member: "default",
};

const roleLabels: Record<string, string> = {
  leader: "قائد", vice: "نائب", chief: "زعيم", elite: "نخبة", member: "عضو",
};

interface MemberCardProps {
  member: any;
  onClick?: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <Card hover onClick={onClick} className="text-center py-6">
      <Avatar src={member.image || ""} name={member.name} size="xl" className="mx-auto mb-3 ring-2 ring-[rgba(0,229,255,0.1)] ring-offset-2 ring-offset-[#050816] rounded-full" />
      <h3 className="font-bold text-base">{member.name}</h3>
      {member.gameId && <p className="text-xs text-[var(--text-dim)] mb-2">{member.gameId}</p>}
      <div className="flex items-center justify-center gap-2 mb-3">
        {member.role && <Badge variant={roleColors[member.role] || "default"}>{roleLabels[member.role] || member.role}</Badge>}
        {member.country && <Badge variant="default">{member.country}</Badge>}
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-dim)] border-t border-[var(--border)] pt-3 mt-3">
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--primary)] tabular-nums">{member.tournaments || member.wins || 0}</p>
          <p className="text-[10px]">بطولات</p>
        </div>
        <div className="w-px h-8 bg-[var(--border)]" />
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--secondary)] tabular-nums">{member.level || "—"}</p>
          <p className="text-[10px]">مستوى</p>
        </div>
        <div className="w-px h-8 bg-[var(--border)]" />
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--warning)] tabular-nums">{member.wins || 0}</p>
          <p className="text-[10px]">فوز</p>
        </div>
      </div>
    </Card>
  );
}
