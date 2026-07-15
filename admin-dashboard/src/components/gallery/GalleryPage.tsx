"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { Upload, Trash2, Image, X, AlertCircle, Loader2 } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGallery();
      setImages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const uploadResult = await api.uploadFile(file);
      await api.addGallery({ label: file.name, src: uploadResult.url });
      await fetchGallery();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteGallery(deleteId);
      setDeleteId(null);
      await fetchGallery();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Gallery</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan&apos;s visual media</p>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square rounded-[18px] bg-[rgba(255,255,255,0.06)] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Gallery</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan&apos;s visual media</p>
          </div>
        </motion.div>
        <GlassCard className="p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-[#FF3B30] mb-4" />
          <p className="text-lg font-bold mb-2">Failed to load gallery</p>
          <p className="text-sm text-[#9CA3AF] mb-4">{error}</p>
          <Button variant="primary" onClick={fetchGallery}>Retry</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Gallery</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan&apos;s visual media</p>
        </div>
      </motion.div>

      {error && (
        <GlassCard className="p-4 flex items-center gap-3 border-l-2 border-l-[#FF3B30]">
          <AlertCircle size={18} className="text-[#FF3B30] shrink-0" />
          <p className="text-sm text-[#FF3B30] flex-1">{error}</p>
        </GlassCard>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      <GlassCard
        className={`
          border-2 border-dashed transition-all duration-300 p-10 text-center cursor-pointer
          ${dragging ? "border-[#E50914] bg-[rgba(229,9,20,0.05)]" : "border-[rgba(255,255,255,0.08)]"}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <Loader2 size={40} className="mx-auto text-[#E50914] mb-3 animate-spin" />
        ) : (
          <Upload size={40} className="mx-auto text-[#6B7280] mb-3" />
        )}
        <p className="text-lg font-bold mb-1">{uploading ? "Uploading..." : "Drop images here"}</p>
        <p className="text-sm text-[#9CA3AF] mb-4">or click to browse (PNG, JPG, WEBP up to 10MB)</p>
        <Button variant="ghost" disabled={uploading}><Image size={16} /> Browse Files</Button>
      </GlassCard>

      {images.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Image size={48} className="mx-auto text-[#6B7280] mb-4" />
          <p className="text-lg font-bold mb-1">No images yet</p>
          <p className="text-sm text-[#9CA3AF]">Upload your first image using the zone above</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-[18px] overflow-hidden aspect-square cursor-pointer"
              onClick={() => setLightbox(item.src)}
            >
              <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-semibold">{item.label}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF3B30]"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!lightbox} onClose={() => setLightbox(null)} className="max-w-4xl bg-transparent border-none shadow-none">
        {lightbox && (
          <img src={lightbox} alt="Gallery" className="w-full rounded-[18px]" />
        )}
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Image">
        <p className="text-[#9CA3AF] mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
