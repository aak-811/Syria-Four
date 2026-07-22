"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { Check, CheckCheck, FileText, Play, Image as ImageIcon } from "lucide-react";

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
}

export default function MessageBubble({ message: msg, isOwn, showAvatar }: Props) {
  const [imgError, setImgError] = useState(false);

  const statusIcon = msg.status === "seen" ? <CheckCheck size={12} className="text-[var(--primary)]" />
    : msg.status === "delivered" ? <CheckCheck size={12} className="text-[var(--text-dim)]" />
    : msg.status === "sent" ? <Check size={12} className="text-[var(--text-dim)]" />
    : <Check size={12} className="text-[var(--text-dim)] opacity-50" />;

  const time = new Date(msg.created_at).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });

  const renderContent = () => {
    if (msg.type === "image" && msg.fileUrl) {
      return (
        <div className="mb-1">
          {imgError ? (
            <div className="w-40 h-32 rounded-[12px] bg-[var(--surface)] flex items-center justify-center">
              <ImageIcon size={24} className="text-[var(--text-dim)]" />
            </div>
          ) : (
            <img src={msg.fileUrl} alt="" className="max-w-[240px] max-h-[200px] rounded-[12px] object-cover cursor-pointer"
              onClick={() => window.open(msg.fileUrl, "_blank")}
              onError={() => setImgError(true)}
            />
          )}
          {msg.content && <p className="text-sm mt-1">{msg.content}</p>}
        </div>
      );
    }
    if (msg.type === "voice" && msg.fileUrl) {
      return (
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <Play size={14} className="text-[var(--bg)]" />
          </button>
          <audio src={msg.fileUrl} controls className="h-8 w-40" />
        </div>
      );
    }
    if (msg.type === "file" && msg.fileUrl) {
      return (
        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-[10px] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors no-underline">
          <FileText size={20} className="text-[var(--primary)]" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{msg.fileName || "ملف"}</p>
            {msg.fileSize ? <p className="text-[10px] text-[var(--text-dim)]">{(msg.fileSize / 1024).toFixed(1)} KB</p> : null}
          </div>
        </a>
      );
    }
    return <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>;
  };

  return (
    <div className={`flex ${isOwn ? "justify-start" : "justify-end"} items-end gap-2 ${!showAvatar ? "mb-0.5" : "mb-2"}`}>
      {isOwn && (
        <div className="flex flex-col items-center gap-1 shrink-0">
          {showAvatar ? (
            msg.senderAvatar ? <img src={msg.senderAvatar} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[10px] font-bold text-white">{(msg.senderName || "?").charAt(0)}</div>
          ) : <div className="w-7" />}
        </div>
      )}
      <div className={`max-w-[75%] ${isOwn ? "order-1" : "order-2"}`}>
        {showAvatar && !isOwn && (
          <p className="text-[10px] text-[var(--text-muted)] mb-0.5 mr-1">{msg.senderName}</p>
        )}
        <div className={`rounded-[14px] px-3.5 py-2 ${isOwn ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30" : "bg-[var(--surface)] border border-[var(--border)]"}`}>
          {renderContent()}
          <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-start" : "justify-end"}`}>
            <span className="text-[9px] text-[var(--text-dim)]">{time}</span>
            {isOwn && statusIcon}
          </div>
        </div>
      </div>
      {!isOwn && (
        <div className="flex flex-col items-center gap-1 shrink-0">
          {showAvatar ? (
            msg.senderAvatar ? <img src={msg.senderAvatar} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-[10px] font-bold text-white">{(msg.senderName || "?").charAt(0)}</div>
          ) : <div className="w-7" />}
        </div>
      )}
    </div>
  );
}
