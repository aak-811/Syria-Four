"use client";

import { useState } from "react";
import { useChat } from "@/lib/chat-store";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import JoinChat from "./JoinChat";
import { Menu } from "lucide-react";

export default function ChatLayout() {
  const { isJoined } = useChat();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!isJoined) return <JoinChat />;

  return (
    <div className="flex h-[calc(100vh-70px-80px)] lg:h-[calc(100vh-70px)] relative overflow-hidden rounded-2xl border border-[var(--border)]" style={{ background: "var(--bg)" }}>
      {/* Sidebar - hidden on mobile, toggleable */}
      <div className={`${showSidebar ? "flex" : "hidden"} lg:flex absolute lg:relative inset-0 lg:inset-auto z-10 lg:z-auto`}>
        <ChatSidebar onClose={() => setShowSidebar(false)} />
      </div>
      {/* Backdrop for mobile sidebar */}
      {showSidebar && <div className="fixed inset-0 bg-black/40 z-[5] lg:hidden" onClick={() => setShowSidebar(false)} />}
      {/* Chat Window */}
      <ChatWindow onToggleSidebar={() => setShowSidebar(true)} />
    </div>
  );
}
