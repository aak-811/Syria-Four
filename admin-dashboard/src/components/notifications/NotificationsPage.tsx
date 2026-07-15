"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { cn, timeAgo } from "@/lib/utils";
import { Bell, CheckCheck, Send, Trash2, AlertTriangle, Info, CheckCircle, XCircle, Loader2 } from "lucide-react";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: "#00E676", bg: "rgba(0,230,118,0.1)" },
  warning: { icon: AlertTriangle, color: "#FFC107", bg: "rgba(255,193,7,0.1)" },
  info: { icon: Info, color: "#E50914", bg: "rgba(229,9,20,0.1)" },
  error: { icon: XCircle, color: "#FF3B30", bg: "rgba(255,59,48,0.1)" },
};

const typeBadgeVariant: Record<string, string> = {
  success: "success",
  warning: "warning",
  info: "info",
  error: "danger",
};

const typeOptions = ["info", "warning", "success", "error"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ message: "", type: "info" });
  const [marking, setMarking] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return n.active;
    return !n.active;
  });

  const handleAdd = async () => {
    if (!form.message.trim()) return;
    setSaving(true);
    try {
      await api.addNotification({ message: form.message.trim(), type: form.type });
      setAddOpen(false);
      setForm({ message: "", type: "info" });
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteNotification(deleteId);
      setDeleteId(null);
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (n: any) => {
    try {
      await api.updateNotification(n.id, { active: !n.active });
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    const active = notifications.filter((n) => n.active);
    if (active.length === 0) return;
    setMarking(true);
    try {
      await Promise.all(active.map((n) => api.updateNotification(n.id, { active: false })));
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Notifications</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Stay updated with clan activity</p>
          </div>
        </motion.div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard className="flex items-start gap-4 p-5">
                <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,255,255,0.06)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">الإشعارات</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">ابق على اطلاع بنشاطات الكلان</p>
          </div>
        </motion.div>
        <GlassCard className="p-12 text-center">
          <Bell size={48} className="mx-auto text-[#FF3B30] mb-4" />
          <p className="text-lg font-bold mb-2">فشل تحميل الإشعارات</p>
          <p className="text-sm text-[#9CA3AF] mb-4">{error}</p>
          <Button variant="primary" onClick={fetchNotifications}>إعادة المحاولة</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-black">الإشعارات</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">ابق على اطلاع بنشاطات الكلان</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead} loading={marking} disabled={marking}>
            <CheckCheck size={16} /> تحديد الكل كمقروء
          </Button>
          <Button variant="primary" glow size="sm" onClick={() => setAddOpen(true)}>
            <Send size={16} /> إرسال إشعار
          </Button>
        </div>
      </motion.div>

      {error && (
        <GlassCard className="p-4 flex items-center gap-3 border-l-2 border-l-[#FF3B30]">
          <AlertTriangle size={18} className="text-[#FF3B30] shrink-0" />
          <p className="text-sm text-[#FF3B30] flex-1">{error}</p>
        </GlassCard>
      )}

      <GlassCard className="p-2">
        <div className="flex gap-1">
          {[
            { id: "all", label: "الكل" },
            { id: "active", label: "نشط" },
            { id: "inactive", label: "غير نشط" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300",
                activeTab === tab.id ? "bg-[#E50914] text-white" : "text-[#6B7280] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell size={48} className="mx-auto text-[#6B7280] mb-4" />
          <p className="text-lg font-bold mb-1">لا توجد إشعارات</p>
          <p className="text-sm text-[#9CA3AF]">
            {activeTab === "all" ? "لا توجد إشعارات بعد" : `لا توجد إشعارات ${activeTab === "active" ? "نشطة" : "غير نشطة"}`}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {filtered.map((n, i) => {
            const config = typeConfig[n.type] || typeConfig.info;
            const badgeVar = typeBadgeVariant[n.type] || "info";
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard
                  hover
                  className={cn(
                    "flex items-start gap-4",
                    n.active && "border-l-2 border-l-[#E50914]"
                  )}
                >
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: config.bg }}>
                    <config.icon size={20} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={badgeVar as any} size="sm">{n.type}</Badge>
                      {n.active && <span className="w-2 h-2 rounded-full bg-[#E50914]" />}
                    </div>
                    <p className="text-sm text-[#9CA3AF]">{n.message}</p>
                    <p className="text-xs text-[#6B7280] mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(n)}
                      className={cn(
                        "w-9 h-5 rounded-full transition-all duration-300 relative",
                        n.active ? "bg-[#E50914]" : "bg-[rgba(255,255,255,0.12)]"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300",
                          n.active ? "left-[18px]" : "left-0.5"
                        )}
                      />
                    </button>
                    <button
                      onClick={() => setDeleteId(n.id)}
                      className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-full transition-colors"
                    >
                      <Trash2 size={16} className="text-[#6B7280]" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="إرسال إشعار">
        <div className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">الرسالة *</label>
            <textarea
              placeholder="نص الإشعار"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">النوع</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full"
            >
              {typeOptions.map((t) => (
                <option key={t} value={t} className="bg-[#1a1a2e] text-white capitalize">{t}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setAddOpen(false)}>إلغاء</Button>
            <Button variant="primary" onClick={handleAdd} loading={saving} disabled={!form.message.trim()}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} إرسال
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="حذف الإشعار">
        <p className="text-[#9CA3AF] mb-6">هل أنت متأكد من حذف هذا الإشعار؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
          <Button variant="danger" onClick={handleDelete}>حذف</Button>
        </div>
      </Modal>
    </div>
  );
}
