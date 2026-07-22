"use client";

import { useState } from "react";
import { useChat } from "@/lib/chat-store";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import JoinChat from "./JoinChat";
import { Menu } from "lucide-react";

export default function ChatLayout() {
  const { isJoined, settings } = useChat();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!isJoined) return <JoinChat />;

  const cssVars = {
    "--chat-bg": settings.chatBg || "#0A0A1A",
    "--chat-header-bg": settings.headerBg || "#0D0D20",
    "--chat-input-bg": settings.inputBg || "#1A1A2E",
    "--chat-own-bubble-bg": settings.ownBubbleBg || "#005C4B",
    "--chat-own-bubble-text": settings.ownBubbleText || "#FFFFFF",
    "--chat-other-bubble-bg": settings.otherBubbleBg || "#1A1A2E",
    "--chat-other-bubble-text": settings.otherBubbleText || "#FFFFFF",
    "--chat-accent": settings.accentColor || "#00E5FF",
  } as React.CSSProperties;

  return (
    <div className="flex h-[calc(100vh-70px-80px)] lg:h-[calc(100vh-70px)] relative overflow-hidden rounded-2xl border border-[var(--border)]" style={{ background: "var(--chat-bg)", ...cssVars }}>
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
