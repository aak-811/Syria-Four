"use client";

import { useState, useRef, useCallback } from "react";
import { useChat } from "@/lib/chat-store";
import { Send, Plus, Smile, X } from "lucide-react";
import { chatApi } from "@/lib/chat-api";

const EMOJI_LIST = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","🥰","😘","👍","❤️","🔥","💯","🎉","🙏","✨","💪","😈","👑","🏆","🛡️","⚔️","🎮","💎","🌟","😂","🥺","😭","😤","🤡","👻","💀","☠️","🫡","🤝"];

export default function MessageInput() {
  const { sendMessage, setTyping } = useChat();
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout>(undefined);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
    setTyping(false);
    if (inputRef.current) inputRef.current.style.height = "auto";
  }, [text, sendMessage, setTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleChange = (value: string) => {
    setText(value);
    setTyping(value.length > 0);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(false), 3000);
    if (inputRef.current) { inputRef.current.style.height = "auto"; inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"; }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await chatApi.uploadFile(file);
      const type = file.type.startsWith("image/") ? "image" : "file";
      const ext = { fileUrl: result.url, fileName: result.name, fileSize: result.size, mimeType: result.type };
      if (text.trim()) { await sendMessage(text.trim(), "text"); setText(""); }
      await sendMessage("", type, ext);
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addEmoji = (emoji: string) => { setText(prev => prev + emoji); setShowEmoji(false); if (inputRef.current) inputRef.current.focus(); };

  return (
    <div className="border-t border-[var(--border)] shrink-0" style={{ background: "var(--bg)" }}>
      {showEmoji && (
        <div className="px-3 pt-2 pb-1 border-b border-[var(--border)]">
          <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
            {EMOJI_LIST.map(e => (
              <button key={e} onClick={() => addEmoji(e)} className="text-2xl hover:scale-125 transition-transform p-0.5">{e}</button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-end gap-1.5 px-3 py-2">
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors text-[var(--text-dim)] hover:text-[var(--text)] shrink-0">
          {uploading ? <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /> : <Plus size={22} />}
        </button>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" accept="image/*,.pdf,.doc,.docx,.zip" />
        <div className="flex-1 relative">
          <textarea ref={inputRef} value={text} onChange={e => handleChange(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={uploading ? "جاري الرفع..." : "اكتب رسالة..."}
            rows={1}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors resize-none min-h-[42px] max-h-[120px]"
            style={{ scrollbarWidth: "thin" }} />
        </div>
        <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors text-[var(--text-dim)] hover:text-[var(--text)] shrink-0">
          {showEmoji ? <X size={20} /> : <Smile size={20} />}
        </button>
        <button onClick={handleSend} disabled={!text.trim()}
          className="p-2.5 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] text-white hover:brightness-110 transition-all disabled:opacity-40 shrink-0 shadow-[0_2px_8px_rgba(0,229,255,0.3)]">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
