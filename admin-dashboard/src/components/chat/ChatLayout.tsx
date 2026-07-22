"use client";

import { useChat } from "@/lib/chat-store";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import JoinChat from "./JoinChat";

export default function ChatLayout() {
  const { isJoined, activeConv } = useChat();

  if (!isJoined) return <JoinChat />;

  return (
    <div className="flex h-[calc(100vh-70px-80px)] lg:h-[calc(100vh-70px)] gap-0 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
      <ChatSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {activeConv ? <ChatWindow /> : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-lg font-bold mb-1">اختر محادثة</h3>
              <p className="text-sm text-[var(--text-muted)]">اختر محادثة من القائمة لبدء الدردشة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
