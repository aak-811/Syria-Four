"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { useChat } from "@/lib/chat-store";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { MoreHorizontal, Users, ArrowLeft, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ChatWindow() {
  const { activeConv, conversations, messages, userId, deleteConversation, setActiveConv } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  const conv = conversations.find(c => c.id === activeConv);
  const convMessages = activeConv ? messages[activeConv] || [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length]);

  const handleDelete = async () => {
    if (activeConv && confirm("حذف المحادثة؟")) {
      await deleteConversation(activeConv);
    }
    setShowMenu(false);
  };

  if (!activeConv || !conv) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveConv(null)} className="lg:hidden p-1 rounded-lg hover:bg-[var(--surface)]">
            <ArrowLeft size={18} />
          </button>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${conv.type === "group" ? "bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)]" : "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"}`}>
            {conv.type === "group" ? <Users size={16} className="text-white" /> : <span className="text-white">{(conv.name || "?").charAt(0)}</span>}
          </div>
          <div>
            <h3 className="font-bold text-sm">{conv.name}</h3>
            {conv.lastMessageAt && <p className="text-[10px] text-[var(--text-muted)]">{formatDate(conv.lastMessageAt)}</p>}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors">
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-44 glass rounded-[12px] py-1 shadow-xl">
                <button onClick={handleDelete} className="w-full text-right px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--surface)] flex items-center gap-2 transition-colors">
                  <Trash2 size={15} /> حذف المحادثة
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide" style={{ background: "var(--bg)" }}>
        {convMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--text-dim)] text-sm">لا توجد رسائل بعد. ابدأ المحادثة!</p>
          </div>
        ) : (
          convMessages.map((msg, i) => {
            const prev = i > 0 ? convMessages[i - 1] : null;
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
