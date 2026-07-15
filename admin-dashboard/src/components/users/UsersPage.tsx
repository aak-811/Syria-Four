"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { Loader2, AlertCircle, Users, Trash2, Save, ChevronDown } from "lucide-react";

interface MemberData {
  _id: string;
  name: string;
  nickname?: string;
  uid?: string;
  level?: string;
  role?: string;
  country?: string;
  joinDate?: string;
  status?: string;
}

const roleColors: Record<string, "danger" | "gold" | "info" | "default" | "success"> = {
  leader: "danger",
  vice: "info",
  chief: "gold",
  elite: "success",
  member: "default",
};

const roleOptions = ["", "leader", "vice", "chief"];

export default function UsersPage() {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleChanges, setRoleChanges] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    setError("");
    try {
      const data = await api.getMembers();
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message || "فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveRole(memberId: string) {
    const newRole = roleChanges[memberId];
    if (!newRole) return;
    setSaving(memberId);
    try {
      await api.updateMember(memberId, { role: newRole });
      setMembers((prev) =>
        prev.map((m) => (m._id === memberId ? { ...m, role: newRole } : m))
      );
      setRoleChanges((prev) => {
        const copy = { ...prev };
        delete copy[memberId];
        return copy;
      });
    } catch (err: any) {
      setError(err.message || "فشل تحديث الدور");
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(memberId: string) {
    setSaving(memberId);
    try {
      await api.deleteMember(memberId);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err.message || "فشل حذف المستخدم");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#E50914] mx-auto" />
          <p className="text-[#9CA3AF] text-sm mt-4">جارٍ تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  if (error && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={40} className="text-[#FF3B30] mx-auto" />
          <p className="text-[#FF3B30] text-sm mt-4">{error}</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={loadMembers}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black">المستخدمين</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">إدارة حسابات المستخدمين والأدوار</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Users size={16} />
          <span>{members.length} إجمالي</span>
        </div>
      </motion.div>

      {error && (
        <div className="flex items-center gap-3 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.2)] rounded-[14px] px-4 py-3">
          <AlertCircle size={16} className="text-[#FF3B30] shrink-0" />
          <p className="text-sm text-[#FF3B30]">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-[#FF3B30] hover:text-white text-xs font-semibold">تجاهل</button>
        </div>
      )}

      {members.length === 0 ? (
        <GlassCard>
          <div className="text-center py-10">
            <Users size={48} className="text-[#6B7280] mx-auto mb-4" />
            <p className="text-[#9CA3AF] font-semibold">لا يوجد مستخدمين</p>
            <p className="text-[#6B7280] text-sm mt-1">أضف أعضاء للبدء</p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">الاسم</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">معرف اللعبة</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">المستوى</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">الدور</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">البلد</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">تاريخ الانضمام</th>
                  <th className="text-right text-xs font-semibold text-[#6B7280] px-4 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, i) => (
                  <motion.tr
                    key={member._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm">{member.name}</span>
                      {member.nickname && (
                        <p className="text-xs text-[#6B7280]">@{member.nickname}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#9CA3AF]">{member.uid || "—"}</td>
                    <td className="px-4 py-3 text-sm">{member.level || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleColors[member.role || "member"] || "default"} size="sm">
                        {member.role || "member"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#9CA3AF]">{member.country || "—"}</td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">
                      {member.joinDate ? formatDate(member.joinDate) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <select
                            value={roleChanges[member._id] ?? member.role ?? ""}
                            onChange={(e) =>
                              setRoleChanges((prev) => ({
                                ...prev,
                                [member._id]: e.target.value,
                              }))
                            }
                            className="rounded-[10px] px-3 py-1.5 text-xs"
                          >
                            {roleOptions.map((r) => (
                              <option key={r} value={r} className="bg-[#1a1a2e]">
                                {r || "بدون دور"}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={saving === member._id}
                          disabled={!roleChanges[member._id]}
                          onClick={() => handleSaveRole(member._id)}
                          className="!px-2"
                        >
                          <Save size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDelete(member._id)}
                          className="!px-2 text-[#FF3B30]"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="تأكيد الحذف">
        <p className="text-[#9CA3AF] text-sm">هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={saving === confirmDelete}
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
          >
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
