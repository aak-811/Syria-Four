"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, Image as ImageIcon } from "lucide-react";

export default function AdminGalleryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getGallery().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addGallery(form);
    setModal(false); setForm({}); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteGallery(row.id); load(); }
  };

  const columns = [
    {
      key: "src", label: "الصورة", render: (v: string) => v ? (
        <img src={v} alt="" className="w-12 h-12 rounded-[8px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      ) : "—",
    },
    { key: "label", label: "التسمية" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">المعرض</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة الصور</p>
        </div>
        <Button onClick={() => { setForm({}); setModal(true); }}><Plus size={16} /> إضافة صورة</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title="إضافة صورة">
        <div className="space-y-4">
          <FormFileUpload label="الصورة" value={form.src || ""} onChange={(url) => setForm({ ...form, src: url })} accept="image/*" />
          <FormInput label="التسمية" value={form.label || ""} onChange={e => setForm({ ...form, label: e.target.value })} />
          <Button onClick={add} className="w-full">إضافة</Button>
        </div>
      </Modal>
    </div>
  );
}
