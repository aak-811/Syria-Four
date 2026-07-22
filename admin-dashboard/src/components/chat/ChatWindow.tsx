"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/lib/chat-store";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { Users } from "lucide-react";

export default function ChatWindow() {
  const { messages, userId, userName, userAvatar, userGameId, conversationId } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!conversationId) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)] shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center shrink-0">
          <Users size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm">SYRIA FOUR</h3>
          <p className="text-[10px] text-[var(--text-muted)]">الدردشة العامة</p>
        </div>
        <div className="mr-auto flex items-center gap-2">
          {userAvatar ? <img src={userAvatar} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[10px] font-bold text-white">{(userName || "?").charAt(0)}</div>}
          <div className="text-left">
            <p className="text-xs font-medium">{userName}</p>
            {userGameId && <p className="text-[9px] text-[var(--text-dim)]">ID: {userGameId}</p>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide" style={{ background: "var(--bg)" }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--text-dim)] text-sm">لا توجد رسائل بعد. ابدأ المحادثة!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const prev = i > 0 ? messages[i - 1] : null;
            const showAvatar = !prev || prev.senderId !== msg.senderId;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === userId}
                showAvatar={showAvatar}
              />
            );
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
