"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

export default function AdminMembersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getMembers().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (edit) await api.updateMember(edit.id, form);
    else await api.addMember(form);
    setModal(false); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteMember(row.id); load(); }
  };

  const columns = [
    { key: "image", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : "—" },
    { key: "name", label: "الاسم" },
    { key: "gameId", label: "معرف اللعبة" },
    { key: "role", label: "الدور" },
    { key: "level", label: "المستوى" },
    { key: "wins", label: "الفوز" },
    { key: "country", label: "البلد" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الأعضاء</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة أعضاء الكلان</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة عضو</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل العضو" : "إضافة عضو"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormFileUpload label="الصورة الشخصية" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="معرف اللعبة" value={form.gameId || ""} onChange={e => setForm({ ...form, gameId: e.target.value })} />
          <FormInput label="العمر" type="number" value={form.age || ""} onChange={e => setForm({ ...form, age: e.target.value })} />
          <FormInput label="الدور (leader/vice/chief/elite/member)" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} />
          <FormInput label="أسلوب اللعب" value={form.playStyle || ""} onChange={e => setForm({ ...form, playStyle: e.target.value })} placeholder="مثال: Sniper, Rusher, Support" />
          <FormInput label="المستوى" type="number" value={form.level || ""} onChange={e => setForm({ ...form, level: e.target.value })} />
          <FormInput label="الفوز" type="number" value={form.wins || ""} onChange={e => setForm({ ...form, wins: e.target.value })} />
          <FormInput label="البلد" value={form.country || ""} onChange={e => setForm({ ...form, country: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPrime || false} onChange={e => setForm({ ...form, isPrime: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-medium text-[var(--text-muted)]">أيقونة برايم</span>
          </label>
          <FormFileUpload label="معرض الصور الشخصية" value={form.galleryImage || ""} onChange={(url) => setForm({ ...form, galleryImage: url })} accept="image/*" />
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-[12px] bg-[rgba(255,215,0,0.06)] border border-[rgba(255,215,0,0.15)]">
              <input type="checkbox" checked={form.goldFrame || false} onChange={e => setForm({ ...form, goldFrame: e.target.checked })} className="w-4 h-4 accent-[#FFD700]" />
              <span className="text-sm font-medium text-[#FFD700]">إطار ذهبي</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-[12px] bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.15)]">
              <input type="checkbox" checked={form.vipBadge || false} onChange={e => setForm({ ...form, vipBadge: e.target.checked })} className="w-4 h-4 accent-[#00E5FF]" />
              <span className="text-sm font-medium text-[#00E5FF]">شارة VIP</span>
            </label>
          </div>
          <FormInput label="لون الاسم (hex)" value={form.nameColor || ""} onChange={e => setForm({ ...form, nameColor: e.target.value })} placeholder="مثل: #FFD700" />
          <FormInput label="لون صفحة العضو (hex)" value={form.profileColor || ""} onChange={e => setForm({ ...form, profileColor: e.target.value })} placeholder="مثل: #8B5CF6" />
          <FormTextarea label="السيرة" value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
