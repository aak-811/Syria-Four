"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Image } from "lucide-react";

const fallback = [
  { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", label: "فريق SYRIA FOUR" },
  { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80", label: "بطولة" },
  { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80", label: "لحظة انتصار" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", label: "تدريبات" },
  { src: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&q=80", label: "منافسة" },
  { src: "https://images.unsplash.com/photo-1552820728-8b83bb6b10f7?w=400&q=80", label: "فريق" },
  { src: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", label: "لعب جماعي" },
  { src: "https://images.unsplash.com/photo-1494376874741-2c20abf8aad7?w=400&q=80", label: "تحدي" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    api.getGallery().then(data => setImages(data.length > 0 ? data : fallback))
      .catch(() => setImages(fallback))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">المعرض</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">صور وفيديوهات SYRIA FOUR</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[14px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
          ))}</div>
        ) : images.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Image size={48} className="mx-auto text-[#6B7280] mb-4" />
            <p className="text-[#9CA3AF]">لا توجد صور</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="animate-fade-slide-up aspect-square rounded-[14px] overflow-hidden cursor-pointer group relative"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setLightbox(img.src)}
              >
                <img src={img.src} alt={img.label || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <Image size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}

        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-[14px]" />
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
