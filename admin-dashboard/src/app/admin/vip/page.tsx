"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import { api } from "@/lib/api";
import { Plus, Crown } from "lucide-react";

export default function AdminVipPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getVipSettings().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (edit) await api.updateVipSetting(edit.id, form);
    else await api.addVipSetting(form);
    setModal(false); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteVipSetting(row.id); load(); }
  };

  const columns = [
    { key: "title", label: "العنوان" },
    { key: "description", label: "الوصف", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
    { key: "instagram1", label: "حساب 1" },
    { key: "instagram2", label: "حساب 2" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">عضوية VIP</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة إعدادات VIP</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة</Button>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل" : "إضافة"}>
        <div className="space-y-4">
          <FormInput label="العنوان" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
          <FormTextarea label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <FormInput label="حساب إنستغرام 1" value={form.instagram1 || ""} onChange={e => setForm({ ...form, instagram1: e.target.value })} />
          <FormInput label="حساب إنستغرام 2" value={form.instagram2 || ""} onChange={e => setForm({ ...form, instagram2: e.target.value })} />
          <FormInput label="رابط 1" value={form.link1 || ""} onChange={e => setForm({ ...form, link1: e.target.value })} />
          <FormInput label="رابط 2" value={form.link2 || ""} onChange={e => setForm({ ...form, link2: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isEnabled || false} onChange={e => setForm({ ...form, isEnabled: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-medium text-[var(--text-muted)]">مفعل</span>
          </label>
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
