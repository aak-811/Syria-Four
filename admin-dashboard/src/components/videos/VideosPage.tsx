"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { VIDEOS_DATA } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Play, Eye, Clock, Plus, Video } from "lucide-react";

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Videos</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your clan&apos;s video content</p>
        </div>
        <Button variant="primary" glow>
          <Plus size={18} /> Add Video
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {VIDEOS_DATA.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard hover className="p-0 overflow-hidden group">
              {/* Thumbnail */}
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
                  <Video size={12} /> YouTube
                </Badge>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-base mb-2 line-clamp-1">{video.title}</h3>
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1"><Eye size={14} /> {formatNumber(video.views)}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {video.uploadedAt}</span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <Button size="sm" variant="ghost" className="flex-1"><Play size={14} /> Play</Button>
                  <Button size="sm" variant="ghost" className="flex-1"><Video size={14} /> Edit</Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
