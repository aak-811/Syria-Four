"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, Trophy } from "lucide-react";

export default function AdminHallOfFamePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getHallOfFame().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (edit) await api.updateHallOfFame(edit.id, form);
    else await api.addHallOfFame(form);
    setModal(false); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteHallOfFame(row.id); load(); }
  };

  const columns = [
    { key: "image", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : <Trophy size={20} className="text-[#FFD700]" /> },
    { key: "title", label: "اللقب" },
    { key: "playerName", label: "اللاعب" },
    { key: "description", label: "الوصف", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">قاعة المشاهير</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة قاعة مشاهير الكلان</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة</Button>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل" : "إضافة"}>
        <div className="space-y-4">
          <FormFileUpload label="صورة اللاعب" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="اللقب" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثل: أكثر لاعب نشطاً" />
          <FormInput label="اسم اللاعب" value={form.playerName || ""} onChange={e => setForm({ ...form, playerName: e.target.value })} />
          <FormInput label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
