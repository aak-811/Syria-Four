"use client";

import { useChat } from "@/lib/chat-store";
import { useState, useEffect } from "react";

export default function TypingIndicator() {
  const { activeConv, typingUsers } = useChat();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const typing = activeConv ? typingUsers[activeConv]?.filter(t => t.isTyping) || [] : [];

  if (typing.length === 0) return null;

  const names = typing.map(t => t.username).join(" و ");
  const text = typing.length === 1 ? `${names} يكتب${dots}` : `${names} يكتبون${dots}`;

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs text-[var(--text-muted)] animate-fade-in">
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>{text}</span>
    </div>
  );
}
