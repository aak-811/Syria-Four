"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { AtSign, Plus, Trash2, Edit3, Crown, Shield, AlertCircle } from "lucide-react";
import type { InstagramAccount } from "@/types";

const ICON_OPTIONS = [
  { value: "crown", label: "Crown", icon: Crown },
  { value: "knight", label: "Knight", icon: Shield },
];

export default function InstagramPage() {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<InstagramAccount | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", username: "", icon: "crown" });
  const [formErrors, setFormErrors] = useState<{ name?: string; username?: string }>({});

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getInstagram();
      setAccounts(data);
    } catch {
      setError("Failed to load Instagram accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", username: "", icon: "crown" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (account: InstagramAccount) => {
    setEditing(account);
    setForm({
      name: account.name,
      username: account.username.replace("@", ""),
      icon: account.icon || "crown",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errors: { name?: string; username?: string } = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.username.trim()) errors.username = "Username is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      username: "@" + form.username.trim().replace(/^@/, ""),
      icon: form.icon,
    };
    try {
      if (editing) {
        await api.updateInstagram(editing.id, payload);
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === editing.id ? { ...a, ...payload } : a
          )
        );
      } else {
        const created = await api.addInstagram(payload);
        setAccounts((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch {
      setError("Failed to save account");
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await api.deleteInstagram(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      setConfirmDelete(null);
    } catch {
      setError("Failed to delete account");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black">Instagram</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Manage Instagram accounts
          </p>
        </div>
        <Button variant="primary" glow onClick={openAdd}>
          <Plus size={18} /> Add Account
        </Button>
      </motion.div>

      {error && (
        <GlassCard className="flex items-center gap-3 text-[#FF3B30]">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchAccounts}
            className="ml-auto"
          >
            Retry
          </Button>
        </GlassCard>
      )}

      {loading ? (
        <GlassCard>
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          </div>
        </GlassCard>
      ) : accounts.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AtSign size={48} className="text-[#6B7280] mb-4" />
            <p className="text-lg font-bold mb-1">No accounts linked</p>
            <p className="text-sm text-[#9CA3AF]">
              Add Instagram accounts to display on the website.
            </p>
            <Button
              variant="primary"
              glow
              onClick={openAdd}
              className="mt-4"
            >
              <Plus size={18} /> Add Account
            </Button>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Icon
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Username
                  </th>
                  <th className="text-right text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, i) => {
                  const IconComponent =
                    account.icon === "crown" ? Crown : Shield;
                  return (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-9 h-9 rounded-full glass flex items-center justify-center">
                          <IconComponent
                            size={16}
                            className={
                              account.icon === "crown"
                                ? "text-[#FFD700]"
                                : "text-[#E50914]"
                            }
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm">
                          {account.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#9CA3AF]">
                          {account.username}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(account)}
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[#FF3B30]"
                            onClick={() => setConfirmDelete(account.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit Account" : "Add Account"}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g. Syria Four"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            error={formErrors.name}
          />
          <Input
            label="Username"
            placeholder="syria_four"
            value={form.username}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                username: e.target.value.replace("@", ""),
              }))
            }
            error={formErrors.username}
          />
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Icon
            </label>
            <div className="flex gap-2">
              {ICON_OPTIONS.map((opt) => {
                const OptIcon = opt.icon;
                const selected = form.icon === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, icon: opt.value }))
                    }
                    className={`flex items-center gap-2 px-4 py-3 rounded-[14px] text-sm font-semibold transition-all duration-300 ${
                      selected
                        ? "bg-[#E50914] text-white"
                        : "glass text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    <OptIcon size={16} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSubmit}
            >
              {editing ? "Save Changes" : "Add Account"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Account"
      >
        <p className="text-[#9CA3AF] text-sm">
          Are you sure you want to delete this Instagram account? This action
          cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() =>
              confirmDelete && deleteAccount(confirmDelete)
            }
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
