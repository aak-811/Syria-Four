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

export default function AdminNotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getNotifications().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addNotification(form);
    setModal(false); setForm({}); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteNotification(row.id); load(); }
  };

  const columns = [
    { key: "message", label: "الرسالة", render: (v: string) => v?.length > 50 ? v.slice(0, 50) + "..." : v || "—" },
    { key: "type", label: "النوع" },
    { key: "active", label: "نشط", render: (v: boolean) => v ? <Badge variant="success">نشط</Badge> : <Badge variant="default">غير نشط</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الإشعارات</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة الإشعارات</p>
        </div>
        <Button onClick={() => { setForm({ active: true }); setModal(true); }}><Plus size={16} /> إضافة إشعار</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title="إضافة إشعار">
        <div className="space-y-4">
          <FormTextarea label="الرسالة" value={form.message || ""} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} />
          <FormInput label="النوع" value={form.type || ""} onChange={e => setForm({ ...form, type: e.target.value })} />
          <Button onClick={add} className="w-full">إضافة</Button>
        </div>
      </Modal>
    </div>
  );
}
