"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { Check, CheckCheck, FileText, Image as ImageIcon } from "lucide-react";

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
}

export default function MessageBubble({ message: msg, isOwn, showAvatar }: Props) {
  const [imgError, setImgError] = useState(false);

  const statusIcon = msg.status === "seen" ? <CheckCheck size={13} className="text-[#53BDEB]" />
    : msg.status === "delivered" ? <CheckCheck size={13} className="text-[var(--text-dim)]" />
    : msg.status === "sent" ? <Check size={13} className="text-[var(--text-dim)]" />
    : <Check size={13} className="text-[var(--text-dim)] opacity-50" />;

  const time = new Date(msg.created_at).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });

  const renderContent = () => {
    if (msg.type === "image" && msg.fileUrl) {
      return (
        <div className="mb-0.5">
          {imgError ? (
            <div className="w-44 h-36 rounded-lg bg-[var(--surface)] flex items-center justify-center"><ImageIcon size={24} className="text-[var(--text-dim)]" /></div>
          ) : (
            <img src={msg.fileUrl} alt="" className="max-w-[220px] max-h-[200px] rounded-lg object-cover cursor-pointer"
              onClick={() => window.open(msg.fileUrl, "_blank")} onError={() => setImgError(true)} />
          )}
          {msg.content && <p className="text-sm mt-1">{msg.content}</p>}
        </div>
      );
    }
    if (msg.type === "file" && msg.fileUrl) {
      return (
        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors no-underline">
          <FileText size={18} className="text-[var(--primary)]" />
          <div className="min-w-0"><p className="text-sm font-medium truncate">{msg.fileName || "ملف"}</p>{msg.fileSize ? <p className="text-[10px] opacity-60">{(msg.fileSize / 1024).toFixed(1)} KB</p> : null}</div>
        </a>
      );
    }
    if (msg.type === "voice" && msg.fileUrl) {
      return <audio src={msg.fileUrl} controls className="h-9 w-48" />;
    }
    return <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>;
  };

  return (
    <div className={`flex ${isOwn ? "justify-start flex-row" : "justify-end flex-row"} items-end gap-1.5 ${showAvatar ? "mt-2" : "mt-0.5"}`}>
      {/* Avatar for others */}
      {!isOwn && showAvatar ? (
        msg.senderAvatar ? <img src={msg.senderAvatar} alt="" className="w-7 h-7 rounded-full shrink-0" />
          : <div className="w-7 h-7 rounded-full shrink-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[9px] font-bold text-white">{(msg.senderName || "?").charAt(0)}</div>
      ) : !isOwn ? <div className="w-7 shrink-0" /> : null}

      <div className={`max-w-[80%] sm:max-w-[70%] ${isOwn ? "order-1" : "order-2"}`}>
        {/* Sender name for others */}
        {!isOwn && showAvatar && (
          <p className="text-[11px] text-[var(--primary)] font-semibold mb-0.5 mr-1">{msg.senderName}</p>
        )}

        {/* Bubble - WhatsApp style */}
        <div className={`px-3.5 py-2 ${isOwn
          ? "rounded-[18px] rounded-bl-[6px] bg-[#005C4B] text-white"
          : "rounded-[18px] rounded-br-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
        }`}>
          {renderContent()}

          {/* Time + Status */}
          <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-start" : "justify-end"} -mb-0.5`}>
            <span className={`text-[10px] ${isOwn ? "text-white/60" : "text-[var(--text-dim)]"}`}>{time}</span>
            {isOwn && <span className="shrink-0">{statusIcon}</span>}
          </div>
        </div>
      </div>

      {/* Avatar for self (hidden) */}
      {isOwn && <div className="w-7 shrink-0" />}
    </div>
  );
}
