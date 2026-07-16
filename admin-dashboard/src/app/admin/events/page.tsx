"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

export default function AdminEventsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getEvents().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (edit) await api.updateEvent(edit.id, form);
    else await api.addEvent(form);
    setModal(false); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteEvent(row.id); load(); }
  };

  const columns = [
    { key: "image", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-[8px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : "—" },
    { key: "title", label: "العنوان" },
    { key: "description", label: "الوصف", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
    { key: "icon", label: "الأيقونة" },
    { key: "reward", label: "المكافأة" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الفعاليات</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة الفعاليات</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة فعالية</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل الفعالية" : "إضافة فعالية"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormFileUpload label="صورة الفعالية" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="العنوان" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
          <FormTextarea label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <FormInput label="الأيقونة (clock/fire/war)" value={form.icon || ""} onChange={e => setForm({ ...form, icon: e.target.value })} />
          <FormInput label="المكافأة" value={form.reward || ""} onChange={e => setForm({ ...form, reward: e.target.value })} placeholder="جائزة الفعالية" />
          <FormInput label="عدد المشاركين" type="number" value={form.participants || ""} onChange={e => setForm({ ...form, participants: e.target.value })} />
          <FormInput label="السكواد" value={form.squad || ""} onChange={e => setForm({ ...form, squad: e.target.value })} placeholder="أسماء السكواد المشارك" />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
