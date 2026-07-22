"use client";

import { ChatProvider } from "@/lib/chat-store";
import PublicLayout from "@/components/layout/PublicLayout";
import ChatLayout from "@/components/chat/ChatLayout";

export default function ChatPageClient() {
  return (
    <PublicLayout>
      <ChatProvider>
        <ChatLayout />
      </ChatProvider>
    </PublicLayout>
  );
}
