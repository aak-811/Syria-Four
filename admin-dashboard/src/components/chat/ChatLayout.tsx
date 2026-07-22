"use client";

import { useChat } from "@/lib/chat-store";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import JoinChat from "./JoinChat";

export default function ChatLayout() {
  const { isJoined } = useChat();

  if (!isJoined) return <JoinChat />;

  return (
    <div className="flex h-[calc(100vh-70px-80px)] lg:h-[calc(100vh-70px)] gap-0 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
