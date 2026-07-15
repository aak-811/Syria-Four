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
import { Swords, Plus, Trash2, Calendar, MapPin, Users, X } from "lucide-react";

const typeBadge: Record<string, "info" | "success" | "gold"> = {
  previous: "info",
  current: "success",
  upcoming: "gold",
};

const modeOptions = ["BR", "Headshot"];
const typeOptions = ["previous", "current", "upcoming"];
const mapTypeOptions = ["snow", "normal"];
const persistentOptions = ["permanent", "temporary"];
const mapDesignOptions = ["ranked", "clash", "custom"];
const prizeTypeOptions = ["diamonds", "account", "prime", "cash"];

interface Tournament {
  _id: string;
  name: string;
  type: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxPlayers?: number;
  mode?: string;
  mapType?: string;
  persistent?: string;
  mapDesign?: string;
  winners?: string;
  prizeType?: string;
  prizeValue?: string;
  gold?: string;
  silver?: string;
}

const emptyForm = {
  name: "",
  type: "upcoming",
  description: "",
  startDate: "",
  endDate: "",
  maxPlayers: "",
  mode: "BR",
  mapType: "normal",
  persistent: "permanent",
  mapDesign: "ranked",
  winners: "",
  prizeType: "diamonds",
  prizeValue: "",
  gold: "",
  silver: "",
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getTournaments();
      setTournaments(data);
    } catch {
      setError("فشل تحميل البطولات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      await api.addTournament(form);
      setShowAdd(false);
      setForm(emptyForm);
      await load();
    } catch {
      setError("فشل إضافة البطولة");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTournament(id);
      setConfirmDelete(null);
      await load();
    } catch {
      setError("فشل حذف البطولة");
    }
  };

  const renderSelect = (label: string, name: string, options: string[], value: string) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#E50914]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[#9CA3AF]">جارٍ تحميل البطولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">البطولات</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">إنشاء وإدارة البطولات</p>
        </div>
        <Button variant="primary" glow onClick={() => setShowAdd(true)}>
          <Plus size={18} /> إضافة بطولة
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

      {tournaments.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Swords size={48} className="mx-auto text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold mb-1">لا توجد بطولات بعد</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">ابدأ بإنشاء أول بطولة لك</p>
          <Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={18} /> إضافة بطولة</Button>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard hover>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-[14px] bg-[rgba(229,9,20,0.12)] flex items-center justify-center shrink-0">
                      <Swords size={22} className="text-[#E50914]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base">{t.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={typeBadge[t.type] || "default"} size="sm">{t.type}</Badge>
                        {t.mode && <span className="text-[11px] text-[#6B7280]">{t.mode}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    {t.startDate && (
                      <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(t.startDate)}</span>
                    )}
                    {t.maxPlayers && (
                      <span className="flex items-center gap-1"><Users size={14} /> {t.maxPlayers}</span>
                    )}
                    {t.mapType && (
                      <span className="flex items-center gap-1"><MapPin size={14} /> {t.mapType}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-[#FF3B30]" onClick={() => setConfirmDelete(t._id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setForm(emptyForm); }} title="إضافة بطولة" className="max-w-2xl">
        <div className="space-y-4">
          <Input label="اسم البطولة" name="name" placeholder="أدخل اسم البطولة" value={form.name} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            {renderSelect("النوع", "type", typeOptions, form.type)}
            {renderSelect("الوضع", "mode", modeOptions, form.mode)}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">الوصف</label>
            <textarea
              name="description"
              rows={3}
              placeholder="وصف البطولة..."
              value={form.description}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="تاريخ البداية" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            <Input label="تاريخ النهاية" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="الحد الأقصى للاعبين" name="maxPlayers" type="number" placeholder="مثال: 100" value={form.maxPlayers} onChange={handleChange} />
            {renderSelect("نوع الخريطة", "mapType", mapTypeOptions, form.mapType)}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderSelect("مستمر", "persistent", persistentOptions, form.persistent)}
            {renderSelect("تصميم الخريطة", "mapDesign", mapDesignOptions, form.mapDesign)}
          </div>

          <Input label="الفائزون" name="winners" placeholder="مثال: الأول، الثاني، الثالث" value={form.winners} onChange={handleChange} />

          <div className="grid grid-cols-3 gap-4">
            {renderSelect("نوع الجائزة", "prizeType", prizeTypeOptions, form.prizeType)}
            <Input label="قيمة الجائزة" name="prizeValue" placeholder="القيمة" value={form.prizeValue} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="ذهب" name="gold" placeholder="مكافأة الذهب" value={form.gold} onChange={handleChange} />
            <Input label="فضة" name="silver" placeholder="مكافأة الفضة" value={form.silver} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <Button variant="ghost" onClick={() => { setShowAdd(false); setForm(emptyForm); }}>إلغاء</Button>
            <Button variant="primary" className="ml-auto" loading={submitting} disabled={!form.name.trim()} onClick={handleSubmit}>
              <Plus size={16} /> إنشاء بطولة
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="تأكيد الحذف">
        <p className="text-[#9CA3AF] text-sm">هل أنت متأكد من حذف هذه البطولة؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
          <Button variant="danger" className="flex-1" onClick={() => handleDelete(confirmDelete!)}>حذف</Button>
        </div>
      </Modal>
    </div>
  );
}
