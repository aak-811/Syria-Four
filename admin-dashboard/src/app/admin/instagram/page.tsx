"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

export default function AdminInstagramPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getInstagram().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addInstagram(form);
    setModal(false); setForm({}); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteInstagram(row.id); load(); }
  };

  const columns = [
    { key: "name", label: "الاسم" },
    { key: "username", label: "اسم المستخدم" },
    { key: "icon", label: "الأيقونة" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">إنستغرام</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة حسابات إنستغرام</p>
        </div>
        <Button onClick={() => { setForm({}); setModal(true); }}><Plus size={16} /> إضافة حساب</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title="إضافة حساب إنستغرام">
        <div className="space-y-4">
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="اسم المستخدم" value={form.username || ""} onChange={e => setForm({ ...form, username: e.target.value })} />
          <Button onClick={add} className="w-full">إضافة</Button>
        </div>
      </Modal>
    </div>
  );
}
