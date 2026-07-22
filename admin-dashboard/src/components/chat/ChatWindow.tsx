"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/lib/chat-store";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { Menu, Users } from "lucide-react";

export default function ChatWindow({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { messages, userId, conversationId, onlineCount } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!conversationId) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* WhatsApp-style Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border)] shrink-0" style={{ background: "var(--bg)" }}>
        <button onClick={onToggleSidebar} className="lg:hidden p-1.5 -mr-1 rounded-lg hover:bg-[var(--surface)] transition-colors">
          <Menu size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center shrink-0">
          <Users size={17} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm truncate">SYRIA FOUR</h3>
          <p className="text-[11px] text-[var(--success)]">{onlineCount} متصل</p>
        </div>
      </div>

      {/* Messages Area - Telegram/WhatsApp style */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-hide" style={{ background: "var(--bg)" }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-3">
                <Users size={26} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-sm text-[var(--text-muted)]">لا توجد رسائل بعد</p>
              <p className="text-xs text-[var(--text-dim)] mt-1">كن أول من يرسل رسالة!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const prev = i > 0 ? messages[i - 1] : null;
            const showAvatar = !prev || prev.senderId !== msg.senderId;
            return <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === userId} showAvatar={showAvatar} />;
          })
        )}
        <TypingIndicator />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
