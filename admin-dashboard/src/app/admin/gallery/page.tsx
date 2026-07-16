"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, Image as ImageIcon, Video, Edit3, Check, X } from "lucide-react";

type TabType = "images" | "videos";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("images");
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const load = async () => {
    setLoading(true);
    const [g, v] = await Promise.all([
      api.getGallery().catch(() => []),
      api.getVideos().catch(() => []),
    ]);
    setImages(g);
    setVideos(v);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    if (tab === "images") {
      if (edit) await api.updateGallery(edit.id, form);
      else await api.addGallery(form);
    } else {
      if (edit) {
        const { id, ...rest } = form;
        await api.updateVideo(id, rest);
      } else await api.addVideo(form);
    }
    setModal(false); load();
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) {
      if (tab === "images") await api.deleteGallery(row.id);
      else await api.deleteVideo(row.id);
      load();
    }
  };

  const startRename = (row: any) => {
    setRenaming(row.id);
    setRenameValue(row.label || row.title || "");
  };

  const doRename = async () => {
    if (renaming) {
      if (tab === "images") await api.renameGallery(renaming, renameValue);
      else await api.updateVideo(renaming, { title: renameValue });
      setRenaming(null);
      load();
    }
  };

  const cancelRename = () => setRenaming(null);

  const imageColumns = [
    { key: "src", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-12 h-12 rounded-[8px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : "—" },
    {
      key: "label", label: "التسمية", render: (v: string, row: any) => (
        renaming === row.id ? (
          <div className="flex items-center gap-1">
            <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
              className="bg-[rgba(255,255,255,0.06)] rounded-[6px] px-2 py-1 text-sm w-28 outline-none border border-[rgba(0,229,255,0.3)]"
              autoFocus onKeyDown={e => e.key === "Enter" && doRename()}
            />
            <button onClick={doRename} className="text-[#00E676] hover:text-[#00E676]/80"><Check size={14} /></button>
            <button onClick={cancelRename} className="text-[#FF3B30] hover:text-[#FF3B30]/80"><X size={14} /></button>
          </div>
        ) : (
          <span className="cursor-pointer hover:text-[#00E5FF]" onClick={() => startRename(row)}>{v || "—"}</span>
        )
      ),
    },
  ];

  const videoColumns = [
    { key: "thumbnail", label: "المصغرة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-12 h-12 rounded-[8px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : "—" },
    {
      key: "title", label: "العنوان", render: (v: string, row: any) => (
        renaming === row.id ? (
          <div className="flex items-center gap-1">
            <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
              className="bg-[rgba(255,255,255,0.06)] rounded-[6px] px-2 py-1 text-sm w-28 outline-none border border-[rgba(0,229,255,0.3)]"
              autoFocus onKeyDown={e => e.key === "Enter" && doRename()}
            />
            <button onClick={doRename} className="text-[#00E676]"><Check size={14} /></button>
            <button onClick={cancelRename} className="text-[#FF3B30]"><X size={14} /></button>
          </div>
        ) : (
          <span className="cursor-pointer hover:text-[#00E5FF]" onClick={() => startRename(row)}>{v || "—"}</span>
        )
      ),
    },
    { key: "url", label: "الرابط", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">المعرض والفيديو</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة الصور ومقاطع الفيديو</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة {tab === "images" ? "صورة" : "فيديو"}</Button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("images")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm font-medium transition-all ${tab === "images" ? "bg-[rgba(0,229,255,0.1)] text-[#00E5FF]" : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]"}`}
        >
          <ImageIcon size={16} /> الصور
        </button>
        <button onClick={() => setTab("videos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm font-medium transition-all ${tab === "videos" ? "bg-[rgba(0,229,255,0.1)] text-[#00E5FF]" : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]"}`}
        >
          <Video size={16} /> الفيديو
        </button>
      </div>

      {loading ? <Spinner /> : (
        tab === "images" ? (
          <DataTable columns={imageColumns} data={images} onEdit={openEdit} onDelete={remove} />
        ) : (
          <DataTable columns={videoColumns} data={videos} onEdit={openEdit} onDelete={remove} />
        )
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل" : "إضافة"}>
        <div className="space-y-4">
          {tab === "images" ? (
            <>
              <FormFileUpload label="الصورة" value={form.src || ""} onChange={(url) => setForm({ ...form, src: url })} accept="image/*" />
              <FormInput label="التسمية" value={form.label || ""} onChange={e => setForm({ ...form, label: e.target.value })} />
            </>
          ) : (
            <>
              <FormInput label="العنوان" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
              <FormFileUpload label="ملف الفيديو" value={form.url || ""} onChange={(url) => setForm({ ...form, url: url })} accept="video/*" />
              <FormFileUpload label="الصورة المصغرة" value={form.thumbnail || ""} onChange={(url) => setForm({ ...form, thumbnail: url })} accept="image/*" />
            </>
          )}
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
