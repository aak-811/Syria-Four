"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import { api } from "@/lib/api";
import { Plus, Upload, Loader2, CheckCircle, Camera } from "lucide-react";

export default function AdminInstagramPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => { setLoading(true); api.getInstagram().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      setForm({ ...form, icon: data.url || data.path || `/uploads/${file.name}` });
    } catch {
      setForm({ ...form, icon: `/uploads/${file.name}` });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const save = async () => {
    try {
      if (edit) await api.updateInstagram(edit.id, form);
      else await api.addInstagram(form);
      setModal(false); setForm({}); load();
    } catch (err: any) {
      alert("خطأ: " + (err.message || "فشل الحفظ"));
    }
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteInstagram(row.id); load(); }
  };

  const columns = [
    { key: "icon", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center"><Camera size={16} className="text-white" /></div>
    ) },
    { key: "name", label: "الاسم" },
    { key: "username", label: "اسم المستخدم" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">إنستغرام</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة حسابات إنستغرام</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة حساب</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل الحساب" : "إضافة حساب"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الصورة الشخصية</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current?.click()}
              className="relative border-2 border-dashed rounded-[14px] p-4 text-center cursor-pointer transition-all duration-300"
              style={{
                borderColor: dragOver ? "rgba(0,229,255,0.6)" : form.icon ? "rgba(0,230,118,0.3)" : "rgba(139,92,246,0.2)",
                backgroundColor: dragOver ? "rgba(0,229,255,0.05)" : form.icon ? "rgba(0,230,118,0.03)" : "rgba(255,255,255,0.02)",
              }}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
                    <Loader2 size={24} className="text-[#00E5FF] animate-spin" />
                  </div>
                  <p className="text-sm text-[#00E5FF] font-medium">جاري الرفع...</p>
                </div>
              ) : form.icon ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[rgba(225,48,108,0.3)]">
                    <img src={form.icon} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle size={14} className="text-[#00E676]" />
                    <span className="text-[#00E676] font-medium">تم الرفع</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setForm({ ...form, icon: "" }); }} className="text-[11px] text-[#FF3B30] hover:underline border-0 bg-transparent cursor-pointer">إزالة</button>
                    <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="text-[11px] text-[#00E5FF] hover:underline border-0 bg-transparent cursor-pointer">تغيير</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(225,48,108,0.1)] to-[rgba(131,58,180,0.1)] flex items-center justify-center">
                    <Upload size={22} className="text-[#E1306C]" />
                  </div>
                  <p className="text-sm text-[#9CA3AF]">
                    <span className="text-[#E1306C] font-semibold">اسحب وأفلت</span> أو <span className="text-[#833AB4] font-semibold">اختر صورة</span>
                  </p>
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelect} />
            </div>
          </div>
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="اسم المستخدم" value={form.username || ""} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="مثال: aak.811" />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
