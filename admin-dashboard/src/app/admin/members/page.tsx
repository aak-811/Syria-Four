"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
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
        <div className="space-y-4">
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="معرف اللعبة" value={form.gameId || ""} onChange={e => setForm({ ...form, gameId: e.target.value })} />
          <FormInput label="الدور" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} />
          <FormInput label="المستوى" value={form.level || ""} onChange={e => setForm({ ...form, level: e.target.value })} />
          <FormInput label="الفوز" value={form.wins || ""} onChange={e => setForm({ ...form, wins: e.target.value })} />
          <FormInput label="البلد" value={form.country || ""} onChange={e => setForm({ ...form, country: e.target.value })} />
          <FormTextarea label="السيرة" value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
