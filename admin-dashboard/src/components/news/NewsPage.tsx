"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { NEWS_DATA } from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";
import {
  Plus, Image, Tags, Calendar, Clock, Eye, Edit3, Trash2,
} from "lucide-react";

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("published");
  const [showEditor, setShowEditor] = useState(false);
  const [preview, setPreview] = useState(false);

  const tabs = [
    { id: "published", label: "Published", count: NEWS_DATA.filter(n => n.status === "published").length },
    { id: "drafts", label: "Drafts", count: NEWS_DATA.filter(n => n.status === "draft").length },
  ];

  const filtered = NEWS_DATA.filter(n => activeTab === "published" ? n.status === "published" : n.status === "draft");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">News</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Create and manage announcements</p>
        </div>
        <Button variant="primary" glow onClick={() => setShowEditor(true)}>
          <Plus size={18} /> New Article
        </Button>
      </motion.div>

      {/* Tabs */}
      <GlassCard className="p-2">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300",
                activeTab === tab.id ? "bg-[#E50914] text-white" : "text-[#6B7280] hover:text-white"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-[11px] px-2 py-0.5 rounded-full font-bold",
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-[rgba(255,255,255,0.06)] text-[#6B7280]"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Articles */}
      <div className="grid gap-4">
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-56 h-40 rounded-[14px] overflow-hidden shrink-0">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="info">{article.category}</Badge>
                  <Badge variant={article.status === "published" ? "success" : "warning"}>
                    {article.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold mb-1">{article.title}</h3>
                <p className="text-sm text-[#9CA3AF] line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(article.publishedAt)}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> 5 min read</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> 1.2k views</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {article.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[#6B7280]">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex md:flex-col gap-2 items-start md:justify-center">
                <Button size="sm" variant="ghost"><Edit3 size={14} /></Button>
                <Button size="sm" variant="ghost" className="text-[#FF3B30]"><Trash2 size={14} /></Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Editor Modal */}
      <Modal open={showEditor} onClose={() => { setShowEditor(false); setPreview(false); }} title={preview ? "Preview" : "Create Article"} className="max-w-3xl">
        {!preview ? (
          <div className="space-y-4">
            <Input label="Article Title" placeholder="Enter a compelling title..." />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Category" placeholder="e.g. Updates, Events" />
              <Input label="Tags" placeholder="tag1, tag2, tag3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Featured Image</label>
              <div className="border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-[14px] p-8 text-center hover:border-[#E50914] transition-colors cursor-pointer">
                <Image size={32} className="mx-auto text-[#6B7280] mb-2" />
                <p className="text-sm text-[#9CA3AF]">Drop an image here or click to browse</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Content</label>
              <textarea
                rows={10}
                placeholder="Write your article content..."
                className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white placeholder:text-[#6B7280] outline-none focus:border-[#E50914] resize-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <Button variant="primary" onClick={() => setPreview(true)}><Eye size={16} /> Preview</Button>
              <Button variant="secondary"><Clock size={16} /> Schedule</Button>
              <Button variant="ghost" className="mr-auto">Save as Draft</Button>
              <Button variant="success">Publish Now</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="rounded-[14px] overflow-hidden h-48 mb-4 bg-[rgba(255,255,255,0.05)]" />
            <h2 className="text-2xl font-bold mb-2">Article Title</h2>
            <p className="text-[#9CA3AF] text-sm mb-4">Category · 5 min read</p>
            <p className="text-[#9CA3AF]">Article content preview...</p>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <Button variant="ghost" onClick={() => setPreview(false)}>Back to Editor</Button>
              <Button variant="primary" className="mr-auto">Publish</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
