"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

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

  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (edit) await api.updateMember(edit.id, form);
    setModal(false); load();
  };

  const columns = [
    { key: "name", label: "الاسم" },
    { key: "gameId", label: "معرف اللعبة" },
    { key: "role", label: "الدور" },
    { key: "level", label: "المستوى" },
    { key: "wins", label: "الفوز" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">القيادات</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة قادة الكلان</p>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={all} onEdit={openEdit} />}

      <Modal open={modal} onClose={() => setModal(false)} title="تعديل القائد">
        <div className="space-y-4">
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="الدور" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} />
          <Button onClick={save} className="w-full">تحديث</Button>
        </div>
      </Modal>
    </div>
  );
}
