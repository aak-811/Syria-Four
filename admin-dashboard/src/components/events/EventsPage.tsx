"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Clock, Flame, Crosshair, Plus, Trash2, X } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  clock: <Clock size={16} />,
  fire: <Flame size={16} />,
  war: <Crosshair size={16} />,
};

const iconOptions = ["clock", "fire", "war"];

interface EventItem {
  _id: string;
  title: string;
  description?: string;
  icon?: string;
  createdAt?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("clock");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch {
      setError("فشل تحميل الفعاليات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await api.addEvent({ title: title.trim(), description, icon });
      setShowAdd(false);
      setTitle("");
      setDescription("");
      setIcon("clock");
      await load();
    } catch {
      setError("فشل إضافة الفعالية");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteEvent(id);
      setConfirmDelete(null);
      await load();
    } catch {
      setError("فشل حذف الفعالية");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#E50914]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[#9CA3AF]">جارٍ تحميل الفعاليات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الفعاليات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">إدارة الفعاليات والأنشطة داخل اللعبة</p>
        </div>
        <Button variant="primary" glow onClick={() => setShowAdd(true)}>
          <Plus size={18} /> إضافة فعالية
        </Button>
      </motion.div>

      {error && (
        <GlassCard className="p-4 border border-[rgba(255,59,48,0.3)]">
          <div className="flex items-center gap-3">
            <X size={18} className="text-[#FF3B30]" />
            <p className="text-sm text-[#FF3B30] flex-1">{error}</p>
            <Button size="sm" variant="ghost" onClick={load}>إعادة المحاولة</Button>
          </div>
        </GlassCard>
      )}

      {events.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Flame size={48} className="mx-auto text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold mb-1">لا توجد فعاليات بعد</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">أنشئ فعاليتك الأولى للبدء</p>
          <Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={18} /> إضافة فعالية</Button>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {events.map((e, i) => (
            <motion.div key={e._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[rgba(255,215,0,0.12)] flex items-center justify-center shrink-0">
                    <span className="text-[#FFD700]">{e.icon && iconMap[e.icon] ? iconMap[e.icon] : <Clock size={22} />}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base">{e.title}</h3>
                    {e.description && <p className="text-sm text-[#9CA3AF] mt-0.5 line-clamp-1">{e.description}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      {e.icon && <Badge variant="gold" size="sm">{e.icon}</Badge>}
                      {e.createdAt && <span className="text-[11px] text-[#6B7280]">{formatDate(e.createdAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-[#FF3B30]" onClick={() => setConfirmDelete(e._id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setTitle(""); setDescription(""); setIcon("clock"); }} title="إضافة فعالية">
        <div className="space-y-4">
          <Input
            label="عنوان الفعالية"
            placeholder="أدخل عنوان الفعالية"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">الوصف</label>
            <textarea
              rows={3}
              placeholder="وصف الفعالية..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white placeholder:text-[#6B7280] outline-none focus:border-[#E50914] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">الأيقونة</label>
            <div className="flex gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setIcon(opt)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-[14px] text-sm font-semibold transition-all duration-300 ${
                    icon === opt
                      ? "bg-[#E50914] text-white"
                      : "bg-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {iconMap[opt]} {opt === "clock" ? "ساعة" : opt === "fire" ? "نار" : "حرب"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <Button variant="ghost" onClick={() => { setShowAdd(false); setTitle(""); setDescription(""); setIcon("clock"); }}>إلغاء</Button>
            <Button variant="primary" className="ml-auto" loading={submitting} disabled={!title.trim()} onClick={handleSubmit}>
              <Plus size={16} /> إنشاء فعالية
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="تأكيد الحذف">
        <p className="text-[#9CA3AF] text-sm">هل أنت متأكد من حذف هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
          <Button variant="danger" className="flex-1" onClick={() => handleDelete(confirmDelete!)}>حذف</Button>
        </div>
      </Modal>
    </div>
  );
}
