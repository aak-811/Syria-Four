"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { GALLERY_DATA } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Upload, Trash2, Image, X } from "lucide-react";

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState(false);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Gallery</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan&apos;s visual media</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <Button variant="danger" size="sm">
              <Trash2 size={16} /> Delete ({selected.size})
            </Button>
          )}
          <Button variant="primary" glow>
            <Upload size={18} /> Upload
          </Button>
        </div>
      </motion.div>

      {/* Upload Drop Zone */}
      <GlassCard
        className={`
          border-2 border-dashed transition-all duration-300 p-10 text-center
          ${dragging ? "border-[#E50914] bg-[rgba(229,9,20,0.05)]" : "border-[rgba(255,255,255,0.08)]"}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
      >
        <Upload size={40} className="mx-auto text-[#6B7280] mb-3" />
        <p className="text-lg font-bold mb-1">Drop images here</p>
        <p className="text-sm text-[#9CA3AF] mb-4">or click to browse (PNG, JPG, WEBP up to 10MB)</p>
        <Button variant="ghost"><Image size={16} /> Browse Files</Button>
      </GlassCard>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {GALLERY_DATA.map((item, i) => (
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
              <p className="text-[10px] text-[#9CA3AF]">{(item.size / 1000000).toFixed(1)} MB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
              className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                selected.has(item.id)
                  ? "bg-[#E50914] border-[#E50914]"
                  : "bg-black/50 border-white/30 opacity-0 group-hover:opacity-100"
              }`}
            >
              {selected.has(item.id) && <X size={12} />}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Modal open={!!lightbox} onClose={() => setLightbox(null)} className="max-w-4xl bg-transparent border-none shadow-none">
        {lightbox && (
          <img src={lightbox} alt="Gallery" className="w-full rounded-[18px]" />
        )}
      </Modal>
    </div>
  );
}
