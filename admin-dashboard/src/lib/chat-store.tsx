"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { chatApi } from "./chat-api";
import type { Conversation, ChatMessage, TypingUser, UserPresence } from "@/types/chat";

function getLS(key: string, fallback = "") {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

interface ChatContextType {
  userId: string;
  userName: string;
  userAvatar: string;
  isJoined: boolean;
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, TypingUser[]>;
  presence: Record<string, UserPresence>;
  activeConv: string | null;
  unreadCount: number;
  join: (name: string) => void;
  leave: () => void;
  setActiveConv: (id: string | null) => void;
  sendMessage: (convId: string, content: string, type?: string, extra?: any) => Promise<void>;
  setTyping: (convId: string, isTyping: boolean) => void;
  loadMessages: (convId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  createConversation: (name: string, members: string[]) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>(null!);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [userId] = useState(() => getLS("chat_user_id") || generateId());
  const [userName, setUserName] = useState(() => getLS("chat_user_name"));
  const [userAvatar, setUserAvatar] = useState(() => getLS("chat_user_avatar"));
  const [isJoined, setIsJoined] = useState(() => !!getLS("chat_user_name"));
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser[]>>({});
  const [presence, setPresence] = useState<Record<string, UserPresence>>({});
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [lastMessageIds, setLastMessageIds] = useState<Record<string, string>>({});

  // Presence polling
  useEffect(() => {
    if (!isJoined) return;
    const fetchPresence = () => chatApi.getPresence().then(p => {
      const map: Record<string, UserPresence> = {};
      p.forEach(u => { map[u.userId] = u; });
      setPresence(map);
    }).catch(() => {});
    fetchPresence();
    const interval = setInterval(fetchPresence, 15000);
    return () => clearInterval(interval);
  }, [isJoined]);

  // Set user online on join
  useEffect(() => {
    if (!isJoined) return;
    chatApi.setPresence({ userId, username: userName, status: "online", lastSeen: new Date().toISOString() }).catch(() => {});
    const handleBeforeUnload = () => {
      navigator.sendBeacon("/api/chat/presence", JSON.stringify({ userId, username: userName, status: "offline", lastSeen: new Date().toISOString() }));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isJoined, userId, userName]);

  // Periodic ping
  useEffect(() => {
    if (!isJoined) return;
    const ping = setInterval(() => {
      chatApi.setPresence({ userId, username: userName, status: "online", lastSeen: new Date().toISOString() }).catch(() => {});
    }, 30000);
    return () => clearInterval(ping);
  }, [isJoined, userId, userName]);

  // Polling for new messages (simpler than WebSocket for now)
  useEffect(() => {
    if (!isJoined || conversations.length === 0) return;
    const interval = setInterval(async () => {
      for (const conv of conversations) {
        try {
          const msgs = await chatApi.getMessages(conv.id);
          const existing = messages[conv.id] || [];
          if (msgs.length > existing.length) {
            setMessages(prev => ({ ...prev, [conv.id]: msgs }));
          }
          // Update unread
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.senderId !== userId) {
            const lastId = lastMessageIds[conv.id];
            if (lastId !== lastMsg.id) {
              setLastMessageIds(prev => ({ ...prev, [conv.id]: lastMsg.id }));
            }
          }
        } catch {}
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isJoined, conversations, userId, messages, lastMessageIds]);

  const unreadCount = conversations.filter(c => {
    const msgs = messages[c.id];
    if (!msgs || msgs.length === 0) return false;
    const last = msgs[msgs.length - 1];
    return last && last.senderId !== userId;
  }).length;

  const refreshConversations = useCallback(async () => {
    try {
      const convs = await chatApi.getConversations();
      setConversations(convs);
    } catch {}
  }, []);

  const loadMessages = useCallback(async (convId: string) => {
    try {
      const msgs = await chatApi.getMessages(convId);
      setMessages(prev => ({ ...prev, [convId]: msgs }));
    } catch {}
  }, []);

  useEffect(() => {
    if (isJoined) refreshConversations();
  }, [isJoined, refreshConversations]);

  useEffect(() => {
    if (activeConv) loadMessages(activeConv);
  }, [activeConv, loadMessages]);

  const join = useCallback((name: string) => {
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00E5FF&color=fff&bold=true`;
    localStorage.setItem("chat_user_id", userId);
    localStorage.setItem("chat_user_name", name);
    localStorage.setItem("chat_user_avatar", avatar);
    setUserName(name);
    setUserAvatar(avatar);
    setIsJoined(true);
  }, [userId]);

  const leave = useCallback(() => {
    chatApi.setPresence({ userId, username: userName, status: "offline", lastSeen: new Date().toISOString() }).catch(() => {});
    localStorage.removeItem("chat_user_name");
    localStorage.removeItem("chat_user_avatar");
    setUserName("");
    setUserAvatar("");
    setIsJoined(false);
    setConversations([]);
    setMessages({});
    setActiveConv(null);
  }, [userId, userName]);

  const sendMessage = useCallback(async (convId: string, content: string, type = "text", extra = {}) => {
    const msg: any = {
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      content,
      type,
      ...extra,
    };
    // Optimistic add
    const tempId = `temp-${Date.now()}`;
    const tempMsg: ChatMessage = {
      id: tempId,
      conversationId: convId,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      content,
      type: type as any,
      status: "sending",
      created_at: new Date().toISOString(),
    };
    setMessages(prev => ({ ...prev, [convId]: [...(prev[convId] || []), tempMsg] }));
    try {
      const sent = await chatApi.sendMessage(convId, msg);
      setMessages(prev => ({
        ...prev,
        [convId]: (prev[convId] || []).map(m => m.id === tempId ? { ...sent, status: "sent" } : m),
      }));
      await refreshConversations();
    } catch {
      setMessages(prev => ({
        ...prev,
        [convId]: (prev[convId] || []).map(m => m.id === tempId ? { ...m, status: "sent" } : m),
      }));
    }
  }, [userId, userName, userAvatar, refreshConversations]);

  const setTyping = useCallback((convId: string, typing: boolean) => {
    chatApi.setTyping({ conversationId: convId, userId, username: userName, isTyping: typing, updatedAt: new Date().toISOString() }).catch(() => {});
  }, [userId, userName]);

  const createConversation = useCallback(async (name: string, members: string[]) => {
    const conv = await chatApi.createConversation({ type: "group", name, createdBy: userId, members: [userId, ...members] });
    await refreshConversations();
    return conv;
  }, [userId, refreshConversations]);

  const deleteConv = useCallback(async (id: string) => {
    await chatApi.deleteConversation(id);
    await refreshConversations();
    if (activeConv === id) setActiveConv(null);
  }, [activeConv, refreshConversations]);

  return (
    <ChatContext.Provider value={{
      userId, userName, userAvatar, isJoined,
      conversations, messages, typingUsers, presence,
      activeConv, unreadCount,
      join, leave, setActiveConv, sendMessage, setTyping,
      loadMessages, refreshConversations, createConversation, deleteConversation: deleteConv,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
