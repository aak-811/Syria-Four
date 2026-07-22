"use client";

import { useState, useRef, useCallback } from "react";
import { useChat } from "@/lib/chat-store";
import { Send, Paperclip, Smile, Mic, X } from "lucide-react";
import { chatApi } from "@/lib/chat-api";

const EMOJI_LIST = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","🥰","😘","🤗","🤩","👍","❤️","🔥","💯","🎉","🙏","✨","💪","🤝","🫡","😈","👑","🏆","🛡️","⚔️","🎮","📱","💎","🌟"];

export default function MessageInput() {
  const { activeConv, sendMessage, setTyping } = useChat();
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout>(undefined);

  const handleSend = useCallback(() => {
    if (!activeConv || !text.trim()) return;
    sendMessage(activeConv, text.trim());
    setText("");
    setTyping(activeConv, false);
  }, [activeConv, text, sendMessage, setTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (value: string) => {
    setText(value);
    if (!activeConv) return;
    setTyping(activeConv, value.length > 0);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(activeConv, false), 3000);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv) return;
    setUploading(true);
    try {
      const result = await chatApi.uploadFile(file);
      const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
      const ext = { fileUrl: result.url, fileName: result.name, fileSize: result.size, mimeType: result.type };
      if (text.trim()) {
        await sendMessage(activeConv, text.trim(), "text");
        setText("");
      }
      await sendMessage(activeConv, "", type, ext);
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setShowEmoji(false);
  };

  if (!activeConv) return null;

  return (
    <div className="border-t border-[var(--border)] p-3 bg-[var(--bg)] shrink-0">
      {showEmoji && (
        <div className="mb-2 p-2 glass rounded-[12px]">
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {EMOJI_LIST.map(e => (
              <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1">{e}</button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--text-dim)] hover:text-[var(--text)]">
          {uploading ? <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /> : <Paperclip size={20} />}
        </button>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.mp3,.wav,.ogg" />
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالة..."
            rows={1}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors resize-none min-h-[40px] max-h-[120px]"
            style={{ scrollbarWidth: "thin" }}
          />
        </div>
        <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--text-dim)] hover:text-[var(--text)]">
          {showEmoji ? <X size={20} /> : <Smile size={20} />}
        </button>
        <button onClick={handleSend} disabled={!text.trim()} className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white hover:brightness-110 transition-all disabled:opacity-40">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
