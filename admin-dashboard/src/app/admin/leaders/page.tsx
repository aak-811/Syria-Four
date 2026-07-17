"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, Crown, Star, Shield, Sparkles, Zap, Flame, Diamond, Gem } from "lucide-react";

const primeIcons = [
  { level: 0, label: "بدون", icon: "—", color: "#6B7280" },
  { level: 1, icon: "★", color: "#9CA3AF", label: "برايم 1" },
  { level: 2, icon: "★★", color: "#6B7280", label: "برايم 2" },
  { level: 3, icon: "★★★", color: "#FFD700", label: "برايم 3" },
  { level: 4, icon: "⚡", color: "#00E5FF", label: "برايم 4" },
  { level: 5, icon: "🔥", color: "#FF6B35", label: "برايم 5" },
  { level: 6, icon: "💎", color: "#8B5CF6", label: "برايم 6" },
  { level: 7, icon: "👑", color: "#FFD700", label: "برايم 7" },
  { level: 8, icon: "⭐", color: "#FF3B30", label: "برايم 8" },
];

export default function AdminLeadersPage() {
  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => {
    setLoading(true);
    api.getMembers().then(d => { setAll(d.filter((m: any) => m.role && ["leader", "vice", "chief"].includes(m.role))); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({ role: "chief" }); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) await api.updateMember(edit.id, form);
      else await api.addMember(form);
      setModal(false); load();
    } catch (err: any) {
      alert("خطأ: " + (err.message || "فشل الحفظ"));
    }
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteMember(row.id); load(); }
  };

  const handleAddImage = (url: string) => {
    const imgs = Array.isArray(form.images) ? [...form.images, url] : [url];
    setForm({ ...form, images: imgs });
  };

  const removeImage = (idx: number) => {
    const imgs = Array.isArray(form.images) ? [...form.images] : [];
    imgs.splice(idx, 1);
    setForm({ ...form, images: imgs });
  };

  const primeLevel = Number(form.prime) || 0;
  const primeData = primeIcons[primeLevel] || primeIcons[0];

  const columns = [
    { key: "image", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : "—" },
    { key: "name", label: "الاسم" },
    { key: "gameId", label: "معرف اللعبة" },
    {
      key: "role", label: "الدور", render: (v: string) => {
        const colors: Record<string, string> = { leader: "#FFD700", vice: "#00E5FF", chief: "#8B5CF6" };
        return <span style={{ color: colors[v] || "#fff" }} className="font-semibold">{v}</span>;
      }
    },
    { key: "level", label: "المستوى" },
    { key: "wins", label: "الفوز" },
    { key: "country", label: "البلد" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">القيادات</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة قادة وشركاء وزعماء الكلان</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة قائد</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={all} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل القائد" : "إضافة قائد"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormFileUpload label="الصورة الشخصية" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="معرف اللعبة (ID)" value={form.gameId || ""} onChange={e => setForm({ ...form, gameId: e.target.value })} />
          <FormInput label="العمر" type="number" value={form.age || ""} onChange={e => setForm({ ...form, age: e.target.value })} />

          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الدور</label>
            <select value={form.role || "chief"} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]">
              <option value="leader">قائد</option>
              <option value="vice">شريك قائد</option>
              <option value="chief">زعيم</option>
            </select>
          </div>

          <FormInput label="أسلوب اللعب" value={form.playStyle || ""} onChange={e => setForm({ ...form, playStyle: e.target.value })} placeholder="مثال: Sniper, Rusher, Support" />
          <FormInput label="المستوى" type="number" value={form.level || ""} onChange={e => setForm({ ...form, level: e.target.value })} />
          <FormInput label="الفوز" type="number" value={form.wins || ""} onChange={e => setForm({ ...form, wins: e.target.value })} />
          <FormInput label="البلد" value={form.country || ""} onChange={e => setForm({ ...form, country: e.target.value })} />

          {/* Prime Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">أيقونة البرايم</label>
            <div className="grid grid-cols-4 gap-2">
              {primeIcons.map(p => (
                <button key={p.level} type="button" onClick={() => setForm({ ...form, prime: String(p.level) })}
                  className={`p-2 rounded-[10px] text-center transition-all border-0 cursor-pointer ${primeLevel === p.level ? "ring-2 ring-[#00E5FF] bg-[rgba(0,229,255,0.1)]" : "bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)]"}`}
                >
                  <div className="text-lg" style={{ color: p.color }}>{p.icon}</div>
                  <div className="text-[9px] text-[#6B7280] mt-0.5">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          <FormInput label="لون الاسم (مثال: #FFD700)" value={form.nameColor || ""} onChange={e => setForm({ ...form, nameColor: e.target.value })} placeholder="#FFD700" />
          <FormInput label="لون الخلفية (مثال: #0a0a2e)" value={form.profileColor || ""} onChange={e => setForm({ ...form, profileColor: e.target.value })} placeholder="#0a0a2e" />

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-[12px] bg-[rgba(255,255,255,0.04)]">
              <input type="checkbox" checked={form.goldFrame || false} onChange={e => setForm({ ...form, goldFrame: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm font-medium text-[var(--text-muted)]">إطار ذهبي</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-[12px] bg-[rgba(255,255,255,0.04)]">
              <input type="checkbox" checked={form.vipBadge || false} onChange={e => setForm({ ...form, vipBadge: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm font-medium text-[var(--text-muted)]">شارة VIP</span>
            </label>
          </div>

          <FormInput label="حساب إنستغرام" value={form.instagram || ""} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="اسم المستخدم" />
          <FormInput label="رقم واتساب" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+31..." />

          <FormTextarea label="نبذة (Bio)" value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">معرض الصور الشخصية</label>
            {Array.isArray(form.images) && form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {form.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-[10px] overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] border-0 cursor-pointer"
                    >إزالة</button>
                  </div>
                ))}
              </div>
            )}
            <FormFileUpload label="" value="" onChange={handleAddImage} accept="image/*" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={save} className="flex-1">{edit ? "تحديث" : "إضافة"}</Button>
            <Button variant="ghost" onClick={() => setModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
