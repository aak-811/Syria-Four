"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { MEMBERS_DATA } from "@/lib/data";
import { cn, formatNumber } from "@/lib/utils";
import {
  Search, Filter, Edit3, Trash2, ChevronUp, ChevronDown, MoreHorizontal,
  Shield, UserX, Crown, Eye,
} from "lucide-react";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger",
  chief: "gold",
  vice: "info",
  elite: "success",
  member: "default",
};

const statusColors: Record<string, "success" | "warning" | "danger"> = {
  active: "success",
  inactive: "warning",
  suspended: "danger",
};

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<typeof MEMBERS_DATA[0] | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = MEMBERS_DATA
    .filter((m) => {
      const matchesSearch = m.name.includes(search) || m.nickname.toLowerCase().includes(search.toLowerCase()) || m.uid.includes(search);
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const valA = sortBy === "name" ? a.name : sortBy === "level" ? a.level : a.wins;
      const valB = sortBy === "name" ? b.name : sortBy === "level" ? b.level : b.wins;
      if (typeof valA === "string") return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const roles = ["all", "leader", "chief", "vice", "elite", "member"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">Members</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan members</p>
      </motion.div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Search by name, nickname or UID..."
              icon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "px-4 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300",
                  roleFilter === role
                    ? "bg-[#E50914] text-white"
                    : "glass text-[#9CA3AF] hover:text-white"
                )}
              >
                {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
            <button className="p-2.5 rounded-[12px] glass text-[#9CA3AF] hover:text-white flex items-center gap-1.5 text-xs font-semibold">
              <Filter size={14} />
              More
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Sort */}
      <div className="flex items-center gap-4 text-xs text-[#6B7280] font-medium">
        <span>Sort by:</span>
        {["name", "level", "wins"].map((s) => (
          <button
            key={s}
            onClick={() => { setSortBy(s); setSortAsc(sortBy === s ? !sortAsc : true); }}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {sortBy === s && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
        ))}
        <span className="mr-auto text-[#9CA3AF]">{filtered.length} members</span>
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <GlassCard hover className="relative overflow-hidden group">
              {/* Top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4">
                <Avatar src={member.avatar} size="xl" status={member.status === "active" ? "online" : member.status === "inactive" ? "offline" : "offline"} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base">{member.name}</h3>
                  <p className="text-xs text-[#6B7280]">@{member.nickname}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={roleColors[member.role]} size="sm">{member.role}</Badge>
                    <Badge variant={statusColors[member.status]} size="sm">{member.status}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black">{formatNumber(member.wins)}</p>
                  <p className="text-[10px] text-[#6B7280] font-medium">Wins</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <div>
                  <p className="text-[10px] text-[#6B7280] font-medium">UID</p>
                  <p className="text-xs font-semibold">{member.uid}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7280] font-medium">Rank</p>
                  <p className="text-xs font-semibold">{member.rank}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7280] font-medium">Level</p>
                  <p className="text-xs font-semibold">{member.level}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="ghost" onClick={() => setSelectedMember(member)} className="flex-1">
                  <Eye size={14} /> View
                </Button>
                <Button size="sm" variant="ghost" className="flex-1">
                  <Edit3 size={14} /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 text-[#FFC107]">
                  <Shield size={14} /> Promote
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 text-[#FF3B30]" onClick={() => setConfirmDelete(member.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* View Modal */}
      <Modal open={!!selectedMember} onClose={() => setSelectedMember(null)} title="Member Details">
        {selectedMember && (
          <div className="text-center">
            <Avatar src={selectedMember.avatar} size="xl" className="mx-auto mb-4" status="online" />
            <h2 className="text-xl font-bold">{selectedMember.name}</h2>
            <p className="text-sm text-[#9CA3AF]">@{selectedMember.nickname}</p>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant={roleColors[selectedMember.role]} size="md">{selectedMember.role}</Badge>
              <Badge variant={statusColors[selectedMember.status]} size="md">{selectedMember.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: "UID", value: selectedMember.uid },
                { label: "Rank", value: selectedMember.rank },
                { label: "Level", value: selectedMember.level },
                { label: "Wins", value: formatNumber(selectedMember.wins) },
                { label: "Country", value: selectedMember.country },
                { label: "Joined", value: selectedMember.joinDate },
              ].map((f) => (
                <div key={f.label} className="glass rounded-[14px] p-3">
                  <p className="text-[10px] text-[#6B7280] font-medium">{f.label}</p>
                  <p className="text-sm font-semibold mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" className="flex-1"><Edit3 size={16} /> Edit Member</Button>
              <Button variant="danger" className="flex-1"><UserX size={16} /> Suspend</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm Delete">
        <p className="text-[#9CA3AF] text-sm">Are you sure you want to delete this member? This action cannot be undone.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => setConfirmDelete(null)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
