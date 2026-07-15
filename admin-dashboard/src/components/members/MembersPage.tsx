"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { cn, formatNumber } from "@/lib/utils";
import {
  Search, Edit3, Trash2, ChevronUp, ChevronDown,
  Eye, Plus, Square, CheckSquare, X, Save, Loader2, AlertCircle, Users,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  gameId: string;
  level: number;
  rank: string;
  role: string;
  country: string;
  age: number;
  weapon: string;
  wins: number;
  joinDate: string;
  instagram: string;
  bio: string;
  image: string;
  prime: number;
  code: string;
  images: string[];
}

interface FormData {
  name: string;
  gameId: string;
  level: number;
  rank: string;
  role: string;
  country: string;
  age: number;
  weapon: string;
  wins: number;
  joinDate: string;
  instagram: string;
  bio: string;
  image: string;
  prime: number;
}

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  leader: "danger",
  chief: "gold",
  vice: "info",
  elite: "success",
  member: "default",
};

const COUNTRIES = [
  "سوريا", "العراق", "مصر", "السعودية", "الأردن", "لبنان",
  "فلسطين", "اليمن", "ليبيا", "تونس", "الجزائر", "المغرب",
  "السودان", "الكويت", "قطر", "الإمارات", "عمان", "البحرين",
];

const RANKS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legendary"];
const ROLES = ["", "leader", "vice", "chief", "elite", "member"];

const defaultForm: FormData = {
  name: "", gameId: "", level: 1, rank: "", role: "member", country: "",
  age: 0, weapon: "", wins: 0, joinDate: new Date().toISOString().split("T")[0],
  instagram: "", bio: "", image: "", prime: 1,
};

function SkeletonCard() {
  return (
    <GlassCard className="p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[rgba(255,255,255,0.06)]" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="h-3 w-20 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
            <div className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="h-6 w-12 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="h-3 w-8 rounded bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-8 rounded bg-[rgba(255,255,255,0.06)]" />
            <div className="h-4 w-16 rounded bg-[rgba(255,255,255,0.06)]" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const filtered = members
    .filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || (m.gameId || "").toLowerCase().includes(q) || String(m.level).includes(q);
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const va = a.name.toLowerCase(), vb = b.name.toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      const va = Number(sortBy === "level" ? a.level : a.wins) || 0;
      const vb = Number(sortBy === "level" ? b.level : b.wins) || 0;
      return sortAsc ? va - vb : vb - va;
    });

  const allSelected = filtered.length > 0 && filtered.every((m) => selectedIds.has(m.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((m) => m.id)));
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData(defaultForm);
    setShowFormModal(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      gameId: member.gameId || "",
      level: member.level ?? 1,
      rank: member.rank || "",
      role: member.role || "member",
      country: member.country || "",
      age: member.age ?? 0,
      weapon: member.weapon || "",
      wins: member.wins ?? 0,
      joinDate: member.joinDate ? member.joinDate.split("T")[0] : new Date().toISOString().split("T")[0],
      instagram: member.instagram || "",
      bio: member.bio || "",
      image: member.image || "",
      prime: member.prime ?? 1,
    });
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      if (editingMember) await api.updateMember(editingMember.id, formData);
      else await api.addMember(formData);
      setShowFormModal(false);
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || "Failed to save member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await api.deleteMember(id);
      setConfirmDelete(null);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || "Failed to delete member");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map((id) => api.deleteMember(id)));
      setSelectedIds(new Set());
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || "Failed to delete members");
    } finally {
      setDeleting(false);
    }
  };

  const updateForm = (key: keyof FormData, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));

  const roles = ["all", "leader", "chief", "vice", "elite", "member"];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Members</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan members</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <Plus size={18} /> Add Member
        </Button>
      </motion.div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Search by name, game ID or level..."
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
          </div>
        </div>
      </GlassCard>

      {/* Sort & Bulk Actions */}
      <div className="flex items-center gap-4 text-xs text-[#6B7280] font-medium flex-wrap">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
          Select All
        </button>
        {selectedIds.size > 0 && (
          <Button size="sm" variant="danger" onClick={handleBulkDelete} loading={deleting}>
            <Trash2 size={14} /> Delete ({selectedIds.size})
          </Button>
        )}
        <span className="text-[#6B7280]">|</span>
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
        <span className="ml-auto text-[#9CA3AF]">
          {loading ? "Loading..." : `${filtered.length} members`}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SkeletonCard />
            </motion.div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <GlassCard className="p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-[#FF3B30] mb-4" />
          <h3 className="text-lg font-bold mb-2">Failed to load members</h3>
          <p className="text-[#9CA3AF] text-sm mb-6">{error}</p>
          <Button variant="primary" onClick={fetchMembers}>
            <Loader2 size={16} /> Retry
          </Button>
        </GlassCard>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <GlassCard className="p-12 text-center">
          <Users size={48} className="mx-auto text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold mb-2">No members found</h3>
          <p className="text-[#9CA3AF] text-sm">
            {search || roleFilter !== "all" ? "Try adjusting your search or filters." : "Click \"Add Member\" to get started."}
          </p>
        </GlassCard>
      )}

      {/* Member Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <GlassCard hover className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-3 left-3 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelect(member.id); }}
                    className="text-[#6B7280] hover:text-white transition-colors"
                  >
                    {selectedIds.has(member.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <Avatar src={member.image || "/placeholder.svg"} size="xl" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">{member.name}</h3>
                    <p className="text-xs text-[#6B7280]">{member.gameId}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {member.role && <Badge variant={roleColors[member.role] || "default"} size="sm">{member.role}</Badge>}
                      {member.country && <Badge variant="default" size="sm">{member.country}</Badge>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black">{formatNumber(member.wins)}</p>
                    <p className="text-[10px] text-[#6B7280] font-medium">Wins</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <div>
                    <p className="text-[10px] text-[#6B7280] font-medium">Game ID</p>
                    <p className="text-xs font-semibold truncate">{member.gameId || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B7280] font-medium">Rank</p>
                    <p className="text-xs font-semibold">{member.rank || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B7280] font-medium">Level</p>
                    <p className="text-xs font-semibold">{member.level ?? "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedMember(member)} className="flex-1">
                    <Eye size={14} /> View
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(member)} className="flex-1">
                    <Edit3 size={14} /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 text-[#FF3B30]" onClick={() => setConfirmDelete(member.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Modal open={!!selectedMember} onClose={() => setSelectedMember(null)} title="Member Details">
        {selectedMember && (
          <div className="text-center">
            <Avatar src={selectedMember.image || "/placeholder.svg"} size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-bold">{selectedMember.name}</h2>
            <p className="text-sm text-[#9CA3AF]">{selectedMember.gameId}</p>
            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              {selectedMember.role && <Badge variant={roleColors[selectedMember.role] || "default"} size="md">{selectedMember.role}</Badge>}
              {selectedMember.country && <Badge variant="default" size="md">{selectedMember.country}</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: "Code", value: selectedMember.code },
                { label: "Rank", value: selectedMember.rank || "—" },
                { label: "Level", value: selectedMember.level ?? "—" },
                { label: "Wins", value: formatNumber(selectedMember.wins) },
                { label: "Country", value: selectedMember.country || "—" },
                { label: "Age", value: selectedMember.age ?? "—" },
                { label: "Weapon", value: selectedMember.weapon || "—" },
                { label: "Joined", value: selectedMember.joinDate ? new Date(selectedMember.joinDate).toLocaleDateString() : "—" },
                { label: "Instagram", value: selectedMember.instagram || "—" },
                { label: "Prime", value: selectedMember.prime ? `#${selectedMember.prime}` : "—" },
              ].map((f) => (
                <div key={f.label} className="glass rounded-[14px] p-3">
                  <p className="text-[10px] text-[#6B7280] font-medium">{f.label}</p>
                  <p className="text-sm font-semibold mt-0.5 truncate">{f.value}</p>
                </div>
              ))}
            </div>
            {selectedMember.bio && (
              <div className="glass rounded-[14px] p-3 mt-4">
                <p className="text-[10px] text-[#6B7280] font-medium">Bio</p>
                <p className="text-sm mt-0.5">{selectedMember.bio}</p>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <Button variant="primary" className="flex-1" onClick={() => { setSelectedMember(null); openEditModal(selectedMember); }}>
                <Edit3 size={16} /> Edit Member
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingMember ? "Edit Member" : "Add Member"}
        className="max-w-2xl"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <Input label="Name *" value={formData.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Full name" />
          <Input label="Game ID" value={formData.gameId} onChange={(e) => updateForm("gameId", e.target.value)} placeholder="In-game username" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Level" type="number" value={formData.level} onChange={(e) => updateForm("level", Number(e.target.value))} />
            <Input label="Wins" type="number" value={formData.wins} onChange={(e) => updateForm("wins", Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Rank</label>
              <select
                value={formData.rank}
                onChange={(e) => updateForm("rank", e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white transition-all duration-300 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]"
              >
                <option value="">Select rank</option>
                {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Country</label>
              <select
                value={formData.country}
                onChange={(e) => updateForm("country", e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white transition-all duration-300 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" type="number" value={formData.age} onChange={(e) => updateForm("age", Number(e.target.value))} />
            <Input label="Weapon" value={formData.weapon} onChange={(e) => updateForm("weapon", e.target.value)} placeholder="Main weapon" />
          </div>
          <Input label="Join Date" type="date" value={formData.joinDate} onChange={(e) => updateForm("joinDate", e.target.value)} />
          <Input label="Instagram" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} placeholder="@username" />
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateForm("bio", e.target.value)}
              rows={3}
              placeholder="Short biography..."
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white placeholder:text-[#6B7280] transition-all duration-300 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] resize-none"
            />
          </div>
          <Input label="Image URL" value={formData.image} onChange={(e) => updateForm("image", e.target.value)} placeholder="https://..." />
          {formData.image && (
            <div className="flex justify-center">
              <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[rgba(255,255,255,0.08)]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => updateForm("role", e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white transition-all duration-300 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r || "No role"}</option>)}
            </select>
          </div>
          {/* Prime visual selector */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Prime</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateForm("prime", n)}
                  className={cn(
                    "w-10 h-10 rounded-full text-xs font-bold transition-all duration-300",
                    formData.prime === n
                      ? "bg-[#E50914] text-white scale-110 shadow-lg shadow-[#E50914]/30"
                      : "bg-[rgba(255,255,255,0.06)] text-[#6B7280] hover:bg-[rgba(255,255,255,0.12)]"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <Button variant="ghost" className="flex-1" onClick={() => setShowFormModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving} disabled={!formData.name.trim()}>
            <Save size={16} /> {editingMember ? "Update" : "Add"} Member
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm Delete">
        <p className="text-[#9CA3AF] text-sm">Are you sure you want to delete this member? This action cannot be undone.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => confirmDelete && handleDelete(confirmDelete)} loading={deleting}>
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
