"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, Medal } from "lucide-react";

export default function AdminAwardsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getAwards().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) await api.updateAward(edit.id, form);
      else await api.addAward(form);
      setModal(false); load();
    } catch (err: any) {
      alert("خطأ: " + (err.message || "فشل الحفظ"));
    }
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteAward(row.id); load(); }
  };

  const columns = [
    { key: "icon", label: "الأيقونة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-[8px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : <Medal size={20} className="text-[#FFD700]" /> },
    { key: "title", label: "الوسام" },
    { key: "holderName", label: "الحائز" },
    { key: "description", label: "الوصف", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الأوسمة النادرة</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة أوسمة الكلان</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة وسام</Button>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل الوسام" : "إضافة وسام"}>
        <div className="space-y-4">
          <FormFileUpload label="أيقونة الوسام" value={form.icon || ""} onChange={(url) => setForm({ ...form, icon: url })} accept="image/*" />
          <FormInput label="اسم الوسام" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثل: مؤسس الكلان" />
          <FormInput label="اسم الحائز" value={form.holderName || ""} onChange={e => setForm({ ...form, holderName: e.target.value })} />
          <FormTextarea label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
