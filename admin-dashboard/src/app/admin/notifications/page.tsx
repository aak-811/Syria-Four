"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus, Bell, Search, Filter, Pin, Archive, Trash2, Copy, Eye,
  Download, Upload, Check, X, ChevronDown, Star, Clock, RefreshCw,
  LampCeiling, Megaphone, Swords, UserPlus, Image, Video,
  AlertTriangle, AlertCircle, CheckCircle, Settings, Award,
} from "lucide-react";

const types = [
  { value: "announcement", label: "إعلان", color: "#00E5FF" },
  { value: "news", label: "أخبار", color: "#8B5CF6" },
  { value: "tournament", label: "بطولة", color: "#FF6B35" },
  { value: "member", label: "عضو", color: "#00E676" },
  { value: "leader", label: "قائد", color: "#FFD700" },
  { value: "gallery", label: "معرض", color: "#FF6B35" },
  { value: "video", label: "فيديو", color: "#E1306C" },
  { value: "maintenance", label: "صيانة", color: "#F59E0B" },
  { value: "warning", label: "تحذير", color: "#EF4444" },
  { value: "error", label: "خطأ", color: "#DC2626" },
  { value: "success", label: "نجاح", color: "#00E676" },
  { value: "system", label: "نظام", color: "#6B7280" },
  { value: "promotion", label: "ترقية", color: "#FFD700" },
  { value: "achievement", label: "إنجاز", color: "#00E5FF" },
  { value: "update", label: "تحديث", color: "#8B5CF6" },
];

const priorities = [
  { value: "low", label: "منخفضة", color: "#6B7280" },
  { value: "normal", label: "عادية", color: "#00E5FF" },
  { value: "high", label: "عالية", color: "#F59E0B" },
  { value: "critical", label: "حرجة", color: "#EF4444" },
];

const categories = [
  { value: "everyone", label: "الجميع" },
  { value: "visitors", label: "الزوار" },
  { value: "members", label: "الأعضاء" },
  { value: "leaders", label: "القادة" },
  { value: "admins", label: "المشرفين" },
];

const statuses = [
  { value: "active", label: "نشط", color: "#00E676" },
  { value: "expired", label: "منتهي", color: "#6B7280" },
  { value: "archived", label: "مؤرشف", color: "#6B7280" },
  { value: "draft", label: "مسودة", color: "#F59E0B" },
];

const typeIcons: Record<string, any> = {
  announcement: Megaphone, news: Bell, tournament: Swords,
  member: UserPlus, leader: Star, gallery: Image,
  video: Video, maintenance: Settings, warning: AlertTriangle,
  error: AlertCircle, success: CheckCircle, system: Bell,
  promotion: Award, achievement: Star, update: RefreshCw,
};

export default function AdminNotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stats, setStats] = useState({ total: 0, unread: 0, pinned: 0, archived: 0, active: 0, expired: 0 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const load = () => {
    setLoading(true);
    api.getNotifications().then((res: any) => {
      const list: any[] = Array.isArray(res) ? res : res?.notifications || [];
      setData(list);
      if (res?.stats) setStats(res.stats);
      else {
        setStats({
          total: list.length,
          unread: list.filter(n => !n.isRead).length,
          pinned: list.filter(n => n.isPinned).length,
          archived: list.filter(n => n.isArchived).length,
          active: list.filter(n => n.status === "active" || !n.status).length,
          expired: list.filter(n => n.status === "expired").length,
        });
      }
    }).catch(() => toast.error("فشل تحميل الإشعارات"))
    .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({ type: "announcement", priority: "normal", category: "everyone", status: "active" }); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) {
        await api.updateNotification(edit.id, form);
        toast.success("تم تحديث الإشعار");
      } else {
        await api.addNotification(form);
        toast.success("تم إنشاء الإشعار");
      }
      setModal(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "فشل الحفظ");
    }
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) {
      try { await api.deleteNotification(row.id); toast.success("تم الحذف"); load(); } catch { toast.error("فشل الحذف"); }
    }
  };

  const duplicate = async (row: any) => {
    try {
      const { id, createdAt, updatedAt, readBy, ...rest } = row;
      await api.addNotification({ ...rest, title: rest.title + " (نسخة)" });
      toast.success("تم النسخ");
      load();
    } catch { toast.error("فشل النسخ"); }
  };

  const togglePin = async (row: any) => {
    try {
      if (row.isPinned) await api.unpinNotification(row.id);
      else await api.pinNotification(row.id);
      toast.success(row.isPinned ? "تم إلغاء التثبيت" : "تم التثبيت");
      load();
    } catch { toast.error("فشل"); }
  };

  const toggleArchive = async (row: any) => {
    try {
      await api.archiveNotification(row.id);
      toast.success("تم الأرشفة");
      load();
    } catch { toast.error("فشل"); }
  };

  const markRead = async (id: string) => {
    try { await api.markAsRead(id); load(); } catch {}
  };

  const handleBulkDelete = async () => {
    if (!confirm(`حذف ${selected.size} إشعار؟`)) return;
    for (const id of selected) {
      try { await api.deleteNotification(id); } catch {}
    }
    toast.success(`تم حذف ${selected.size} إشعار`);
    setSelected(new Set());
    load();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    let list = [...data];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => (n.title || "").toLowerCase().includes(q) || (n.message || "").toLowerCase().includes(q));
    }
    if (typeFilter) list = list.filter(n => n.type === typeFilter);
    if (statusFilter) list = list.filter(n => (n.status || "active") === statusFilter);
    return list;
  }, [data, search, typeFilter, statusFilter]);

  const columns = [
    {
      key: "select",
      label: <input type="checkbox" onChange={e => { if (e.target.checked) setSelected(new Set(filteredData.map(n => n.id))); else setSelected(new Set()); }} checked={selected.size === filteredData.length && filteredData.length > 0} className="accent-[var(--primary)]" />,
      render: (_: any, row: any) => <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} className="accent-[var(--primary)]" onClick={e => e.stopPropagation()} />,
    },
    { key: "title", label: "العنوان", render: (v: string, row: any) => (
      <div className="flex items-center gap-2">
        {row.isPinned && <Pin size={12} className="text-[#FFD700] shrink-0" />}
        <span className="font-medium truncate max-w-[200px]">{v || "—"}</span>
        {!row.isRead && <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" />}
      </div>
    )},
    { key: "type", label: "النوع", render: (v: string) => {
      const t = types.find(x => x.value === v);
      return <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${t?.color || "#6B7280"}20`, color: t?.color || "#6B7280" }}>{t?.label || v}</span>;
    }},
    { key: "priority", label: "الأولوية", render: (v: string) => {
      const p = priorities.find(x => x.value === v);
      return <span className="text-[11px] font-medium" style={{ color: p?.color || "#6B7280" }}>{p?.label || v}</span>;
    }},
    { key: "category", label: "الفئة", render: (v: string) => {
      const c = categories.find(x => x.value === v);
      return <span className="text-xs text-[var(--text-muted)]">{c?.label || v || "الجميع"}</span>;
    }},
    { key: "status", label: "الحالة", render: (v: string) => {
      const s = statuses.find(x => x.value === (v || "active"));
      return <Badge variant={v === "active" ? "success" : v === "expired" ? "default" : v === "archived" ? "default" : "warning"}>{s?.label || v || "نشط"}</Badge>;
    }},
    { key: "createdAt", label: "التاريخ", render: (v: string) => v ? <span className="text-xs text-[var(--text-muted)]">{new Date(v).toLocaleDateString("ar-SA")}</span> : "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الإشعارات</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة وإرسال الإشعارات</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة إشعار</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "الإجمالي", value: stats.total, color: "#00E5FF" },
          { label: "غير مقروء", value: stats.unread, color: "#EF4444" },
          { label: "مثبت", value: stats.pinned, color: "#FFD700" },
          { label: "نشط", value: stats.active, color: "#00E676" },
          { label: "منتهي", value: stats.expired, color: "#6B7280" },
          { label: "مؤرشف", value: stats.archived, color: "#6B7280" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-[14px] p-3 text-center">
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="glass rounded-[18px] p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input placeholder="بحث في الإشعارات..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] pr-10 pl-4 py-2.5 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-medium glass text-[var(--text-muted)] hover:text-white transition-all border-0 cursor-pointer"
            ><Filter size={14} /> فلترة <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} /></button>
            {selected.size > 0 && (
              <button onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-medium bg-[rgba(229,9,20,0.12)] text-[var(--danger)] hover:bg-[rgba(229,9,20,0.2)] transition-all border-0 cursor-pointer"
              ><Trash2 size={14} /> حذف {selected.size}</button>
            )}
            <Button onClick={load} variant="ghost" size="sm"><RefreshCw size={14} /></Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[10px] px-3 py-2 text-xs text-white outline-none focus:border-[var(--primary)]"
            >
              <option value="">كل الأنواع</option>
              {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[10px] px-3 py-2 text-xs text-white outline-none focus:border-[var(--primary)]"
            >
              <option value="">كل الحالات</option>
              {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? <Spinner /> : (
        <DataTable columns={columns} data={filteredData} onEdit={openEdit} onDelete={remove}
          renderActions={(row: any) => (
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); setPreview(row); }}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:text-white transition-all border-0 bg-transparent cursor-pointer"
                title="معاينة"><Eye size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); togglePin(row); }}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:text-[#FFD700] transition-all border-0 bg-transparent cursor-pointer"
                title={row.isPinned ? "إلغاء التثبيت" : "تثبيت"}><Pin size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); duplicate(row); }}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:text-white transition-all border-0 bg-transparent cursor-pointer"
                title="نسخ"><Copy size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); toggleArchive(row); }}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:text-white transition-all border-0 bg-transparent cursor-pointer"
                title="أرشفة"><Archive size={14} /></button>
            </div>
          )}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل الإشعار" : "إشعار جديد"} className="max-w-2xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormInput label="العنوان" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="عنوان الإشعار" />
          <FormTextarea label="الرسالة" value={form.message || ""} onChange={e => setForm({ ...form, message: e.target.value })} rows={2} placeholder="نص مختصر" />
          <FormTextarea label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="نص كامل (اختياري)" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">النوع</label>
              <select value={form.type || "announcement"} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]"
              >
                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الأولوية</label>
              <select value={form.priority || "normal"} onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]"
              >
                {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الفئة المستهدفة</label>
              <select value={form.category || "everyone"} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]"
              >
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الحالة</label>
              <select value={form.status || "active"} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]"
              >
                {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput label="لون الإشعار (hex)" value={form.color || ""} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="#00E5FF" />
            <FormInput label="الأيقونة" value={form.icon || ""} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Bell" />
          </div>

          <FormFileUpload label="الصورة" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="الرابط" value={form.link || ""} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />

          <div className="grid grid-cols-2 gap-3">
            <FormInput label="تاريخ البدء" type="datetime-local" value={form.createdAt ? form.createdAt.slice(0, 16) : ""} onChange={e => setForm({ ...form, createdAt: e.target.value })} />
            <FormInput label="تاريخ الانتهاء" type="datetime-local" value={form.expiresAt ? form.expiresAt.slice(0, 16) : ""} onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPinned || false} onChange={e => setForm({ ...form, isPinned: e.target.checked })} className="accent-[#FFD700]" />
              <span className="text-sm flex items-center gap-1"><Pin size={14} /> مثبت</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active || false} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-[var(--primary)]" />
              <span className="text-sm flex items-center gap-1"><Bell size={14} /> منشور</span>
            </label>
          </div>

          <Button onClick={save} className="w-full">{edit ? "تحديث" : "نشر الإشعار"}</Button>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title || "معاينة الإشعار"}>
        {preview && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${preview.color || "#00E5FF"}20`, color: preview.color || "#00E5FF" }}
            ><Bell size={28} /></div>
            <div className="flex justify-center gap-2 mb-3 flex-wrap">
              <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: `${(types.find(t => t.value === preview.type)?.color || "#6B7280")}20`, color: types.find(t => t.value === preview.type)?.color || "#6B7280" }}
              >{types.find(t => t.value === preview.type)?.label || preview.type}</span>
              {preview.isPinned && <span className="text-[11px] px-2.5 py-1 rounded-full bg-[rgba(255,215,0,0.12)] text-[#FFD700]"><Pin size={12} className="inline" /> مثبت</span>}
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-2">{preview.message || preview.description || ""}</p>
            {preview.image && <img src={preview.image} alt="" className="w-full h-40 object-cover rounded-[14px] mb-3" />}
            {preview.link && <a href={preview.link} target="_blank" className="text-xs text-[var(--primary)] no-underline hover:underline">فتح الرابط</a>}
            {preview.createdAt && <p className="text-[10px] text-[var(--text-dim)] mt-3">{new Date(preview.createdAt).toLocaleString("ar-SA")}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
