"use client";

import { useState, useRef } from "react";
import { Upload, Image, FileVideo, Link, CheckCircle, Loader2 } from "lucide-react";

interface FormFileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

export default function FormFileUpload({ label, value, onChange, accept = "image/*,video/*" }: FormFileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      onChange(data.url || data.path || `/uploads/${file.name}`);
    } catch {
      onChange(`/uploads/${file.name}`);
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

  const isImage = value && /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)$/i.test(value);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !value && !uploading && inputRef.current?.click()}
        className="relative border-2 border-dashed rounded-[14px] p-4 text-center cursor-pointer transition-all duration-300 overflow-hidden"
        style={{
          borderColor: dragOver ? "rgba(0,229,255,0.6)" : value ? "rgba(0,230,118,0.3)" : "rgba(139,92,246,0.2)",
          backgroundColor: dragOver ? "rgba(0,229,255,0.05)" : value ? "rgba(0,230,118,0.03)" : "rgba(255,255,255,0.02)",
        }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
              <Loader2 size={24} className="text-[#00E5FF] animate-spin" />
            </div>
            <p className="text-sm text-[#00E5FF] font-medium">جاري الرفع...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2">
            {isImage ? (
              <div className="relative w-full max-h-[120px] rounded-[10px] overflow-hidden">
                <img src={value} alt="" className="w-full h-full object-contain max-h-[120px]" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-[rgba(0,230,118,0.1)] flex items-center justify-center">
                <FileVideo size={24} className="text-[#00E676]" />
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle size={14} className="text-[#00E676]" />
              <span className="text-[#00E676] font-medium">تم الرفع</span>
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleSelect}
              />
              <button
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="text-[11px] text-[#FF3B30] hover:underline"
              >
                إزالة
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="text-[11px] text-[#00E5FF] hover:underline"
              >
                تغيير
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(0,229,255,0.1)] to-[rgba(139,92,246,0.1)] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.05)]">
              <Upload size={22} className="text-[#00E5FF]" />
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">
                <span className="text-[#00E5FF] font-semibold">اسحب وأفلت</span> أو <span className="text-[#8B5CF6] font-semibold">اختر ملف</span>
              </p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">{accept === "image/*,video/*" ? "صور أو فيديوهات" : accept === "image/*" ? "صور فقط" : "فيديو فقط"}</p>
            </div>
          </div>
        )}
        {!uploading && (
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleSelect}
          />
        )}
      </div>
      {value && !uploading && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
          <Link size={12} />
          <span className="truncate">{value.split("/").pop()}</span>
        </div>
      )}
    </div>
  );
}
