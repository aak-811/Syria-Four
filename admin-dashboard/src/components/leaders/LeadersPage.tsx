"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Member } from "@/types";
import {
  Crown, Star, Shield, ExternalLink, Edit3, Trash2, RefreshCw, Plus, UserX, Loader2, AlertCircle, Users,
} from "lucide-react";

type Role = "leader" | "vice" | "chief";
const LEADER_ROLES: Role[] = ["leader", "vice", "chief"];

const ROLE_GROUP_LABELS: Record<Role, string> = {
  leader: "القادة",
  vice: "شركاء القادة",
  chief: "الزعماء",
};

const ROLE_GROUP_ICONS: Record<Role, typeof Crown> = {
  leader: Crown,
  vice: Star,
  chief: Shield,
};

const ROLE_BADGE_VARIANT: Record<Role, "danger" | "info" | "gold"> = {
  leader: "danger",
  vice: "info",
  chief: "gold",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function LeadersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch {
      setError("فشل تحميل القيادات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const leaders = members.filter((m) => LEADER_ROLES.includes(m.role as Role));

  const grouped = LEADER_ROLES.map((role) => ({
    role,
    label: ROLE_GROUP_LABELS[role],
    Icon: ROLE_GROUP_ICONS[role],
    items: leaders.filter((m) => m.role === role),
  }));

  const handleSave = async () => {
    if (!editingMember) return;
    setSaving(true);
    try {
      await api.updateMember(editingMember.id, editingMember);
      setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? editingMember : m)));
      setEditingMember(null);
    } catch {
      setError("فشل حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await api.updateMember(confirmDelete.id, { ...confirmDelete, role: "" });
      setMembers((prev) => prev.map((m) => (m.id === confirmDelete.id ? { ...m, role: "" } : m)));
      setConfirmDelete(null);
    } catch {
      setError("فشل إزالة القائد");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 size={40} className="animate-spin text-[#E50914] mx-auto" />
          <p className="text-[#9CA3AF] text-sm">جارٍ تحميل القيادات...</p>
        </div>
      </div>
    );
  }

  if (error && !members.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle size={48} className="text-[#FF3B30] mx-auto" />
          <h3 className="text-xl font-bold">فشل التحميل</h3>
          <p className="text-[#9CA3AF] text-sm">{error}</p>
          <Button variant="primary" onClick={fetchMembers}>
            <RefreshCw size={16} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">القيادات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">إدارة الأعضاء ذوي الأدوار القيادية</p>
        </div>
        <Button variant="ghost" onClick={fetchMembers}>
          <RefreshCw size={16} /> تحديث
        </Button>
      </motion.div>

      {/* Role Groups */}
      {grouped.map(({ role, label, Icon, items }) => (
        <div key={role}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <Icon size={22} className={cn(
              role === "leader" ? "text-[#E50914]" : role === "vice" ? "text-[#00E676]" : "text-[#FFD700]"
            )} />
            <h2 className="text-lg font-bold">{label}</h2>
            <span className="text-xs text-[#6B7280] bg-[rgba(255,255,255,0.06)] px-3 py-1 rounded-full">
              {items.length}
            </span>
          </motion.div>

          {items.length === 0 ? (
            <GlassCard className="text-center py-8">
              <Users size={32} className="mx-auto text-[#6B7280] mb-2" />
              <p className="text-sm text-[#6B7280]">لا يوجد أعضاء بهذا الدور</p>
            </GlassCard>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {items.map((member) => (
                <motion.div key={member.id} variants={itemVariants}>
                  <GlassCard hover className="relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF6B35] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-4">
                      <Avatar src={member.image || ""} size="xl" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{member.name}</h3>
                        <p className="text-xs text-[#6B7280] truncate">{member.gameId || member.rank || ""}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={ROLE_BADGE_VARIANT[role]} size="sm">
                            {role}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black">{member.wins || "0"}</p>
                        <p className="text-[10px] text-[#6B7280] font-medium">فوز</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                      {member.instagram ? (
                        <a
                          href={`https://instagram.com/${member.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#E50914] transition-colors"
                        >
                          <ExternalLink size={14} />
                          {member.instagram}
                        </a>
                      ) : (
                        <span className="text-xs text-[#6B7280]">لا يوجد إنستغرام</span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-2 rounded-[10px] glass text-[#9CA3AF] hover:text-white transition-colors"
                          title="تعديل القائد"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(member)}
                          className="p-2 rounded-[10px] glass text-[#FF3B30] hover:bg-[rgba(255,59,48,0.15)] transition-colors"
                          title="إزالة القائد"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      ))}

      {/* Edit Modal */}
      <Modal open={!!editingMember} onClose={() => setEditingMember(null)} title="تعديل القائد">
        {editingMember && (
          <div className="space-y-4">
            <Input
              label="الاسم"
              value={editingMember.name || ""}
              onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
            />
            <Input
              label="معرف اللعبة"
              value={editingMember.gameId || ""}
              onChange={(e) => setEditingMember({ ...editingMember, gameId: e.target.value })}
            />
            <Input
              label="الدور"
              value={editingMember.role || ""}
              onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
            />
            <Input
              label="إنستغرام"
              value={editingMember.instagram || ""}
              onChange={(e) => setEditingMember({ ...editingMember, instagram: e.target.value })}
            />
            <Input
              label="فوز"
              type="number"
              value={editingMember.wins || "0"}
              onChange={(e) => setEditingMember({ ...editingMember, wins: e.target.value })}
            />
            <Input
              label="رابط الصورة"
              value={editingMember.image || ""}
              onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
            />
            {error && <p className="text-[#FF3B30] text-sm">{error}</p>}
            <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <Button variant="ghost" className="flex-1" onClick={() => setEditingMember(null)}>
                إلغاء
              </Button>
              <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
                <Plus size={16} /> حفظ التغييرات
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="إزالة القائد">
        {confirmDelete && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar src={confirmDelete.image || ""} size="lg" />
              <div>
                <p className="font-bold">{confirmDelete.name}</p>
                <p className="text-sm text-[#9CA3AF]">الدور: {confirmDelete.role}</p>
              </div>
            </div>
            <p className="text-[#9CA3AF] text-sm">
              هل أنت متأكد من إزالة الدور القيادي لهذا العضو؟ سيؤدي ذلك إلى مسح دوره.
            </p>
            {error && <p className="text-[#FF3B30] text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>
                إلغاء
              </Button>
              <Button variant="danger" className="flex-1" loading={saving} onClick={handleDelete}>
                <UserX size={16} /> إزالة الدور
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
