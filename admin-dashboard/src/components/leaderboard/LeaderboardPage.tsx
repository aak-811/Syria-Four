"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import type { LeaderboardEntry } from "@/types";
import {
  Plus, Edit3, Trash2, RefreshCw, Loader2, AlertCircle, Trophy, Medal, Swords,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const defaultForm = { name: "", glory: "", wars: "" };

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LeaderboardEntry | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [confirmDelete, setConfirmDelete] = useState<LeaderboardEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getLeaderboard();
      setEntries(data);
    } catch {
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const sorted = [...entries].sort((a, b) => {
    const aGlory = Number(a.glory) || 0;
    const bGlory = Number(b.glory) || 0;
    return bGlory - aGlory;
  });

  const openAdd = () => {
    setForm(defaultForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (entry: LeaderboardEntry) => {
    setForm({ name: entry.name || "", glory: entry.glory || "", wars: entry.wars || "" });
    setEditing(entry);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = { name: form.name.trim(), glory: form.glory, wars: form.wars };
      if (editing) {
        const updated = await api.updateLeaderboardEntry(editing.id, payload);
        setEntries((prev) => prev.map((e) => (e.id === editing.id ? updated : e)));
      } else {
        const created = await api.addLeaderboardEntry(payload);
        setEntries((prev) => [...prev, created]);
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditing(null);
    } catch {
      setError("Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    setError("");
    try {
      await api.deleteLeaderboardEntry(confirmDelete.id);
      setEntries((prev) => prev.filter((e) => e.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch {
      setError("Failed to delete entry");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 size={40} className="animate-spin text-[#E50914] mx-auto" />
          <p className="text-[#9CA3AF] text-sm">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error && !entries.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle size={48} className="text-[#FF3B30] mx-auto" />
          <h3 className="text-xl font-bold">Failed to load</h3>
          <p className="text-[#9CA3AF] text-sm">{error}</p>
          <Button variant="primary" onClick={fetchEntries}>
            <RefreshCw size={16} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Leaderboard</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage leaderboard entries sorted by glory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={fetchEntries}>
            <RefreshCw size={16} />
          </Button>
          <Button variant="primary" glow onClick={openAdd}>
            <Plus size={18} /> Add Entry
          </Button>
        </div>
      </motion.div>

      {/* Empty State */}
      {sorted.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Trophy size={48} className="mx-auto text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold mb-1">No entries yet</h3>
          <p className="text-[#9CA3AF] text-sm mb-6">Add your first leaderboard entry to get started</p>
          <Button variant="primary" glow onClick={openAdd}>
            <Plus size={18} /> Add Entry
          </Button>
        </GlassCard>
      ) : (
        <>
          {/* Table */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <GlassCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)]">
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">#</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                      <th className="text-right p-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Glory</th>
                      <th className="text-right p-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Wars</th>
                      <th className="text-right p-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((entry, i) => (
                      <motion.tr
                        key={entry.id}
                        variants={itemVariants}
                        className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {i === 0 ? (
                              <Medal size={18} className="text-[#FFD700]" />
                            ) : i === 1 ? (
                              <Medal size={18} className="text-[#9CA3AF]" />
                            ) : i === 2 ? (
                              <Medal size={18} className="text-[#CD7F32]" />
                            ) : (
                              <span className="text-sm text-[#6B7280] font-mono w-[18px] text-center">
                                {i + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">{entry.name}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-[#FFD700]">{entry.glory || "0"}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="flex items-center justify-end gap-1.5 text-sm">
                            <Swords size={14} className="text-[#6B7280]" />
                            {entry.wars || "0"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(entry)}
                              className="p-2 rounded-[10px] glass text-[#9CA3AF] hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(entry)}
                              className="p-2 rounded-[10px] glass text-[#FF3B30] hover:bg-[rgba(255,59,48,0.15)] transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          <p className="text-xs text-[#6B7280] text-right">
            Showing {sorted.length} entr{sorted.length === 1 ? "y" : "ies"} · Sorted by glory descending
          </p>
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setError(""); }} title={editing ? "Edit Entry" : "Add Entry"}>
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Player name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Glory"
            type="number"
            placeholder="0"
            value={form.glory}
            onChange={(e) => setForm({ ...form, glory: e.target.value })}
          />
          <Input
            label="Wars"
            type="number"
            placeholder="0"
            value={form.wars}
            onChange={(e) => setForm({ ...form, wars: e.target.value })}
          />
          {error && <p className="text-[#FF3B30] text-sm">{error}</p>}
          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <Button variant="ghost" className="flex-1" onClick={() => { setShowForm(false); setError(""); }}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
              {editing ? <Edit3 size={16} /> : <Plus size={16} />}
              {editing ? "Save Changes" : "Add Entry"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Entry">
        {confirmDelete && (
          <div>
            <p className="text-[#9CA3AF] text-sm">
              Are you sure you want to delete <strong className="text-white">{confirmDelete.name}</strong> from the leaderboard? This cannot be undone.
            </p>
            {error && <p className="text-[#FF3B30] text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" loading={saving} onClick={handleDelete}>
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
