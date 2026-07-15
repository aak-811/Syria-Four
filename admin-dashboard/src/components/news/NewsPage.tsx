"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import {
  Plus, Trash2, Bell, AlertTriangle, Info, CheckCircle,
} from "lucide-react";

interface NotificationItem {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  active: boolean;
  createdAt: string;
}

const typeVariant = {
  info: "info",
  warning: "warning",
  success: "success",
  error: "danger",
} as const;

const typeIcon = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: Bell,
} as const;

export default function NewsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState<NotificationItem["type"]>("info");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNotifications();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "فشل تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const tabs = [
    { id: "all", label: "الكل", count: items.length },
    { id: "active", label: "نشط", count: items.filter(n => n.active).length },
    { id: "inactive", label: "غير نشط", count: items.filter(n => !n.active).length },
  ];

  const filtered = items.filter(n => {
    if (activeTab === "all") return true;
    return activeTab === "active" ? n.active : !n.active;
  });

  const handleToggle = async (item: NotificationItem) => {
    try {
      const updated = await api.updateNotification(item.id, { active: !item.active });
      setItems(prev => prev.map(n => n.id === item.id ? { ...n, active: updated.active ?? !n.active } : n));
    } catch {
      // revert on error
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return;
    api.deleteNotification(id).then(() => {
      setItems(prev => prev.filter(n => n.id !== id));
    }).catch(() => {});
  };

  const handleCreate = async () => {
    if (!newMessage.trim()) return;
    setSubmitting(true);
    try {
      const created = await api.addNotification({ message: newMessage, type: newType, active: true });
      setItems(prev => [...prev, created]);
      setShowModal(false);
      setNewMessage("");
      setNewType("info");
    } catch {
      // error feedback could go here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الأخبار</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">إنشاء وإدارة الإعلانات</p>
        </div>
        <Button variant="primary" glow onClick={() => setShowModal(true)}>
          <Plus size={18} /> مقال جديد
        </Button>
      </motion.div>

      {/* Tabs */}
      <GlassCard className="p-2">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300",
                activeTab === tab.id ? "bg-[#E50914] text-white" : "text-[#6B7280] hover:text-white"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-[11px] px-2 py-0.5 rounded-full font-bold",
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-[rgba(255,255,255,0.06)] text-[#6B7280]"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i}>
              <div className="animate-pulse space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
                  <div className="h-5 w-14 rounded-full bg-[rgba(255,255,255,0.06)]" />
                </div>
                <div className="h-5 w-3/4 rounded bg-[rgba(255,255,255,0.06)]" />
                <div className="h-4 w-1/2 rounded bg-[rgba(255,255,255,0.04)]" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-24 rounded bg-[rgba(255,255,255,0.04)]" />
                  <div className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.06)]" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <GlassCard className="text-center py-12">
          <AlertTriangle size={40} className="mx-auto text-[#FF3B30] mb-4" />
          <p className="text-[#FF3B30] font-semibold mb-2">{error}</p>
          <Button variant="secondary" onClick={fetchData}>إعادة المحاولة</Button>
        </GlassCard>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <GlassCard className="text-center py-12">
          <Bell size={40} className="mx-auto text-[#6B7280] mb-4" />
          <p className="text-[#9CA3AF] font-semibold">لا توجد إشعارات</p>
          {activeTab !== "all" && (
            <p className="text-[#6B7280] text-sm mt-1">جرب تبديل الألسنة أو إنشاء مقال جديد</p>
          )}
        </GlassCard>
      )}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid gap-4">
          {filtered.map((item, i) => {
            const Icon = typeIcon[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard hover className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0 mt-1">
                    <Icon size={20} className="text-[#9CA3AF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={typeVariant[item.type]}>{item.type}</Badge>
                      <Badge variant={item.active ? "success" : "warning"}>
                        {item.active ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                    <p className="text-sm text-white font-medium">{item.message}</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {item.createdAt ? formatDate(item.createdAt) : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-center shrink-0">
                    <button
                      onClick={() => handleToggle(item)}
                      className={cn(
                        "w-10 h-6 rounded-full transition-colors duration-300 relative",
                        item.active ? "bg-[#00E676]" : "bg-[rgba(255,255,255,0.12)]"
                      )}
                    >
                      <span className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow",
                        item.active ? "translate-x-[18px]" : "translate-x-0.5"
                      )} />
                    </button>
                    <Button size="sm" variant="ghost" className="text-[#FF3B30] !p-2" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="مقال جديد" className="max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">الرسالة</label>
            <textarea
              rows={4}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="أدخل نص الإشعار..."
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white placeholder:text-[#6B7280] outline-none focus:border-[#E50914] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">النوع</label>
            <div className="flex gap-2">
              {(["info", "warning", "success", "error"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={cn(
                    "px-4 py-2 rounded-[12px] text-sm font-semibold transition-all duration-300 capitalize",
                    newType === t
                      ? "bg-[#E50914] text-white"
                      : "bg-[rgba(255,255,255,0.06)] text-[#6B7280] hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <Button variant="ghost" onClick={() => setShowModal(false)}>إلغاء</Button>
            <Button variant="primary" className="ml-auto" loading={submitting} onClick={handleCreate}>
              <Plus size={16} /> إنشاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
