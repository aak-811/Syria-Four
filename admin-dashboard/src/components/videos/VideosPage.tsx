"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { Play, Eye, Clock, Plus, Trash2, Video, AlertCircle, Loader2 } from "lucide-react";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", thumbnail: "" });

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getVideos();
      setVideos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.url.trim()) return;
    setSaving(true);
    try {
      const payload: any = { title: form.title.trim(), url: form.url.trim() };
      if (form.thumbnail.trim()) payload.thumbnail = form.thumbnail.trim();
      await api.addVideo(payload);
      setAddOpen(false);
      setForm({ title: "", url: "", thumbnail: "" });
      await fetchVideos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteVideo(deleteId);
      setDeleteId(null);
      await fetchVideos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Videos</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan&apos;s video content</p>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-0 overflow-hidden">
                <div className="aspect-video bg-[rgba(255,255,255,0.06)] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">الفيديوهات</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">إدارة محتوى الفيديو للكلان</p>
          </div>
        </motion.div>
        <GlassCard className="p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-[#FF3B30] mb-4" />
          <p className="text-lg font-bold mb-2">فشل تحميل الفيديوهات</p>
          <p className="text-sm text-[#9CA3AF] mb-4">{error}</p>
          <Button variant="primary" onClick={fetchVideos}>إعادة المحاولة</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-black">الفيديوهات</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">إدارة محتوى الفيديو للكلان</p>
        </div>
        <Button variant="primary" glow onClick={() => setAddOpen(true)}>
          <Plus size={18} /> إضافة فيديو
        </Button>
      </motion.div>

      {error && (
        <GlassCard className="p-4 flex items-center gap-3 border-l-2 border-l-[#FF3B30]">
          <AlertCircle size={18} className="text-[#FF3B30] shrink-0" />
          <p className="text-sm text-[#FF3B30] flex-1">{error}</p>
        </GlassCard>
      )}

      {videos.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Video size={48} className="mx-auto text-[#6B7280] mb-4" />
          <p className="text-lg font-bold mb-1">لا توجد فيديوهات بعد</p>
          <p className="text-sm text-[#9CA3AF]">أضف فيديو الأول باستخدام الزر أعلاه</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover className="p-0 overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg shadow-[rgba(229,9,20,0.3)]">
                      <Play size={28} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 glass rounded-[10px] px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
                    <Clock size={12} /> {video.duration}
                  </div>
                  <Badge variant="danger" className="absolute top-3 right-3">
                    <Video size={12} /> يوتيوب
                  </Badge>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base mb-2 line-clamp-1">{video.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1"><Eye size={14} /> {formatNumber(video.views)}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {video.uploadedAt}</span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => window.open(video.url, "_blank")}>
                      <Play size={14} /> تشغيل
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => setDeleteId(video.id)}>
                      <Trash2 size={14} /> حذف
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="إضافة فيديو">
        <div className="space-y-4">
          <Input
            label="العنوان *"
            placeholder="عنوان الفيديو"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="الرابط *"
            placeholder="https://youtube.com/watch?v=..."
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <Input
            label="رابط الصورة المصغرة"
            placeholder="https://example.com/thumb.jpg"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setAddOpen(false)}>إلغاء</Button>
            <Button variant="primary" onClick={handleAdd} loading={saving} disabled={!form.title.trim() || !form.url.trim()}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} حفظ
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="حذف الفيديو">
        <p className="text-[#9CA3AF] mb-6">هل أنت متأكد من حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>إلغاء</Button>
          <Button variant="danger" onClick={handleDelete}>حذف</Button>
        </div>
      </Modal>
    </div>
  );
}
