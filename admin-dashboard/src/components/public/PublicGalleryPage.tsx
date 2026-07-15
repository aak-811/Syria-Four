"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Image } from "lucide-react";

export default function PublicGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => { api.getGallery().then(setImages).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">المعرض</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">صور وفيديوهات SYRIA FOUR</p>
      </motion.div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-[14px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
        ))}</div>
      ) : images.length === 0 ? (
        <GlassCard className="p-12 text-center"><Image size={48} className="mx-auto text-[#6B7280] mb-4" /><p className="text-[#9CA3AF]">لا توجد صور</p></GlassCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="aspect-square rounded-[14px] overflow-hidden cursor-pointer group relative"
              onClick={() => setLightbox(img.src)}
            >
              <img src={img.src} alt={img.label || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Image size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-[14px]" />
        </div>
      )}
    </div>
  );
}
