"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

const typeMap: Record<string, string> = { previous: "سابقة", current: "جارية", upcoming: "قادمة" };

export default function AdminTournamentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getTournaments().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({ type: "upcoming" }); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (edit) await api.updateTournament(edit.id, form);
    else await api.addTournament(form);
    setModal(false); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteTournament(row.id); load(); }
  };

  const columns = [
    { key: "name", label: "الاسم" },
    { key: "type", label: "النوع", render: (v: string) => <Badge variant={v === "current" ? "success" : v === "upcoming" ? "primary" : "default"}>{typeMap[v] || v}</Badge> },
    { key: "mode", label: "الوضع" },
    { key: "teamsCount", label: "الفرق" },
    { key: "startDate", label: "التاريخ", render: (v: string) => v ? new Date(v).toLocaleDateString() : "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">البطولات</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة البطولات</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة بطولة</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل البطولة" : "إضافة بطولة"}>
        <div className="space-y-4">
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormTextarea label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <FormInput label="النوع (current/upcoming/previous)" value={form.type || ""} onChange={e => setForm({ ...form, type: e.target.value })} />
          <FormInput label="الوضع" value={form.mode || ""} onChange={e => setForm({ ...form, mode: e.target.value })} />
          <FormInput label="تاريخ البداية" type="date" value={form.startDate || ""} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          <FormInput label="تاريخ النهاية" type="date" value={form.endDate || ""} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          <FormInput label="نوع الجائزة" value={form.prizeType || ""} onChange={e => setForm({ ...form, prizeType: e.target.value })} />
          <FormInput label="قيمة الجائزة" value={form.prizeValue || ""} onChange={e => setForm({ ...form, prizeValue: e.target.value })} />
          <FormInput label="عدد الفرق" value={form.teamsCount || ""} onChange={e => setForm({ ...form, teamsCount: e.target.value })} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
