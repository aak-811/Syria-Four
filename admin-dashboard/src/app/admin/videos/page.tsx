"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, Video } from "lucide-react";

export default function AdminVideosPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getVideos().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addVideo(form);
    setModal(false); setForm({}); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteVideo(row.id); load(); }
  };

  const columns = [
    { key: "title", label: "العنوان" },
    { key: "url", label: "الفيديو", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الفيديو</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة مقاطع الفيديو</p>
        </div>
        <Button onClick={() => { setForm({}); setModal(true); }}><Plus size={16} /> إضافة فيديو</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title="إضافة فيديو">
        <div className="space-y-4">
          <FormInput label="العنوان" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
          <FormFileUpload label="ملف الفيديو" value={form.url || ""} onChange={(url) => setForm({ ...form, url: url })} accept="video/*" />
          <FormFileUpload label="الصورة المصغرة" value={form.thumbnail || ""} onChange={(url) => setForm({ ...form, thumbnail: url })} accept="image/*" />
          <Button onClick={add} className="w-full">إضافة</Button>
        </div>
      </Modal>
    </div>
  );
}
