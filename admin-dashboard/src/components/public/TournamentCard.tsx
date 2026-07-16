"use client";

import Card from "@/components/ui/Card";
import CountdownTimer from "./CountdownTimer";
import { Medal, Clock, Users2, Gift, Calendar } from "lucide-react";

interface TournamentCardProps {
  tournament: any;
  onClick?: () => void;
}

const typeStyles: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: "قادمة", bg: "rgba(0,229,255,0.12)", color: "var(--primary)" },
  current: { label: "جارية", bg: "rgba(0,230,118,0.12)", color: "var(--success)" },
  previous: { label: "سابقة", bg: "rgba(255,255,255,0.06)", color: "var(--text-muted)" },
};

export default function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const style = typeStyles[tournament.type as string] || typeStyles.previous;

  return (
    <Card hover onClick={onClick} className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(139,92,246,0.03)] rounded-full blur-[50px]" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-[16px] bg-[rgba(139,92,246,0.1)] flex items-center justify-center shrink-0 overflow-hidden">
            {tournament.logo ? (
              <img src={tournament.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Medal size={28} className="text-[var(--secondary)]" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base">{tournament.name}</h3>
            {tournament.description && <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{tournament.description}</p>}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: style.bg, color: style.color }}>
                {style.label}
              </span>
              {tournament.mode && <span className="text-[11px] text-[var(--text-dim)]">{tournament.mode}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-dim)]">
          {tournament.type !== "previous" && tournament.startDate && (
            <span className="flex items-center gap-1.5 bg-[rgba(0,229,255,0.06)] rounded-[10px] px-3 py-1.5">
              <Clock size={12} className="text-[var(--primary)]" />
              <CountdownTimer targetDate={tournament.startDate} />
            </span>
          )}
          {tournament.teamsCount && (
            <span className="flex items-center gap-1">
              <Users2 size={14} className="text-[var(--secondary)]" /> {tournament.teamsCount} فريق
            </span>
          )}
          {(tournament.prizeValue || tournament.prizeType) && (
            <span className="flex items-center gap-1">
              <Gift size={14} className="text-[var(--warning)]" /> {tournament.prizeValue} {tournament.prizeType}
            </span>
          )}
          {tournament.startDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-[var(--text-muted)]" /> {new Date(tournament.startDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
