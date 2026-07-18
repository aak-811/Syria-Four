"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Image, Video, FileVideo } from "lucide-react";

const fallbackImages = [
  { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", label: "فريق SYRIA FOUR" },
  { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80", label: "بطولة" },
  { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80", label: "لحظة انتصار" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", label: "تدريبات" },
  { src: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&q=80", label: "منافسة" },
  { src: "https://images.unsplash.com/photo-1552820728-8b83bb6b10f7?w=400&q=80", label: "فريق" },
  { src: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", label: "لعب جماعي" },
  { src: "https://images.unsplash.com/photo-1494376874741-2c20abf8aad7?w=400&q=80", label: "تحدي" },
];

const fallbackVideos = [
  { title: "مونتاج SYRIA FOUR", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "" },
  { title: "أفضل اللقطات", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"images" | "videos">("images");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getGallery().catch(() => fallbackImages),
      api.getVideos().catch(() => fallbackVideos),
    ]).then(([g, v]) => {
      setImages(g.length > 0 ? g : fallbackImages);
      setVideos(v.length > 0 ? v : fallbackVideos);
    }).catch(() => {
      setImages(fallbackImages);
      setVideos(fallbackVideos);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <h1 className="text-2xl font-black">المعرض</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">صور وفيديوهات SYRIA FOUR</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setTab("images")}
            className={`px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300 flex items-center gap-2 border-0 cursor-pointer ${
              tab === "images" ? "bg-[#00E5FF] text-[#050816] shadow-[0_0_20px_rgba(0,229,255,0.3)]" : "glass text-[#9CA3AF] hover:text-white"
            }`}
          ><Image size={16} /> الصور</button>
          <button onClick={() => setTab("videos")}
            className={`px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300 flex items-center gap-2 border-0 cursor-pointer ${
              tab === "videos" ? "bg-[#00E5FF] text-[#050816] shadow-[0_0_20px_rgba(0,229,255,0.3)]" : "glass text-[#9CA3AF] hover:text-white"
            }`}
          ><Video size={16} /> الفيديوهات</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[14px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
          ))}</div>
        ) : tab === "images" ? (
          images.length === 0 ? (
            <GlassCard className="p-12 text-center"><Image size={48} className="mx-auto text-[#6B7280] mb-4" /><p className="text-[#9CA3AF]">لا توجد صور</p></GlassCard>
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
          )
        ) : (
          videos.length === 0 ? (
            <GlassCard className="p-12 text-center"><Video size={48} className="mx-auto text-[#6B7280] mb-4" /><p className="text-[#9CA3AF]">لا توجد فيديوهات</p></GlassCard>
          ) : (
            <div className="grid gap-4">
              {videos.map((v, i) => (
                <div key={i} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <GlassCard className="overflow-hidden p-0">
                    <div className="aspect-video rounded-[18px] overflow-hidden bg-[rgba(0,0,0,0.3)]">
                      {v.url ? (
                        v.url.includes("youtube") || v.url.includes("youtu.be") ? (
                          <iframe src={v.url} title={v.title || ""} className="w-full h-full" allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            style={{ border: "none" }}
                          />
                        ) : (
                          <video src={v.url} controls className="w-full h-full" style={{ objectFit: "contain" }} />
                        )
                      ) : v.thumbnail ? (
                        <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FileVideo size={48} className="text-[#6B7280]" /></div>
                      )}
                    </div>
                    {v.title && (
                      <div className="p-4">
                        <h3 className="font-bold text-sm">{v.title}</h3>
                      </div>
                    )}
                  </GlassCard>
                </div>
              ))}
            </div>
          )
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
