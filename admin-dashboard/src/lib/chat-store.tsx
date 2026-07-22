"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { chatApi } from "./chat-api";
import type { ChatMessage, UserPresence } from "@/types/chat";

function getLS(key: string, fallback = "") {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

interface ChatContextType {
  userId: string;
  userName: string;
  userAvatar: string;
  isJoined: boolean;
  joinError: string;
  conversationId: string | null;
  messages: ChatMessage[];
  typingUsers: string[];
  onlineCount: number;
  presence: Record<string, UserPresence>;
  settings: Record<string, string>;
  join: (name: string, password: string) => Promise<boolean>;
  leave: () => void;
  sendMessage: (content: string, type?: string, extra?: any) => Promise<void>;
  setTyping: (typing: boolean) => void;
}

const ChatContext = createContext<ChatContextType>(null!);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [userId] = useState(() => getLS("chat_user_id") || generateId());
  const [userName, setUserName] = useState(() => getLS("chat_user_name"));
  const [userAvatar, setUserAvatar] = useState(() => getLS("chat_user_avatar"));
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [presence, setPresence] = useState<Record<string, UserPresence>>({});
  const [settings, setSettings] = useState<Record<string, string>>({});

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

  useEffect(() => {
    if (!isJoined) return;
    chatApi.setPresence({ userId, username: userName, status: "online", lastSeen: new Date().toISOString() }).catch(() => {});
    const fn = () => navigator.sendBeacon("/api/chat/presence", JSON.stringify({ userId, username: userName, status: "offline", lastSeen: new Date().toISOString() }));
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [isJoined, userId, userName]);

  useEffect(() => {
    if (!isJoined) return;
    const ping = setInterval(() => chatApi.setPresence({ userId, username: userName, status: "online", lastSeen: new Date().toISOString() }).catch(() => {}), 30000);
    return () => clearInterval(ping);
  }, [isJoined, userId, userName]);

  useEffect(() => {
    if (!isJoined || !conversationId) return;
    const interval = setInterval(async () => {
      try {
        const [msgs, typing] = await Promise.all([
          chatApi.getMessages(conversationId),
          chatApi.getTypingUsers(conversationId).catch(() => []),
        ]);
        setMessages(msgs);
        setTypingUsers(typing.filter((t: any) => t.isTyping && t.userId !== userId).map((t: any) => t.username));
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [isJoined, conversationId, userId]);

  const onlineCount = Object.values(presence).filter(p => p.status === "online").length;

  const join = useCallback(async (name: string, password: string): Promise<boolean> => {
    setJoinError("");
    try {
      const result = await chatApi.join(name, password);
      if (!result.conversation) { setJoinError("خطأ في إنشاء المحادثة"); return false; }
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00E5FF&color=fff&bold=true`;
      localStorage.setItem("chat_user_id", userId);
      localStorage.setItem("chat_user_name", name);
      localStorage.setItem("chat_user_avatar", avatar);
      setUserName(name);
      setUserAvatar(avatar);
      setConversationId(result.conversation.id);
      setIsJoined(true);
      // Load per-member chat settings
      chatApi.getMySettings(name).then(s => {
        if (s && Object.keys(s).length) setSettings(s);
      }).catch(() => {});
      return true;
    } catch (err: any) {
      setJoinError(err.message || "كلمة السر خاطئة");
      return false;
    }
  }, [userId]);

  const leave = useCallback(() => {
    chatApi.setPresence({ userId, username: userName, status: "offline", lastSeen: new Date().toISOString() }).catch(() => {});
    localStorage.removeItem("chat_user_name");
    localStorage.removeItem("chat_user_avatar");
    setUserName(""); setUserAvatar(""); setIsJoined(false); setConversationId(null); setMessages([]);
  }, [userId, userName]);

  const sendMessage = useCallback(async (content: string, type = "text", extra = {}) => {
    if (!conversationId) return;
    const msg: any = { senderId: userId, senderName: userName, senderAvatar: userAvatar, content, type, ...extra };
    const tempId = `temp-${Date.now()}`;
    const tempMsg: ChatMessage = { id: tempId, conversationId, senderId: userId, senderName: userName, senderAvatar: userAvatar, content, type: type as any, status: "sending", created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);
    try {
      const sent = await chatApi.sendMessage(conversationId, msg);
      setMessages(prev => prev.map(m => m.id === tempId ? { ...sent, status: "sent" } : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "sent" } : m));
    }
  }, [conversationId, userId, userName, userAvatar]);

  const setTyping = useCallback((typing: boolean) => {
    if (!conversationId) return;
    chatApi.setTyping({ conversationId, userId, username: userName, isTyping: typing, updatedAt: new Date().toISOString() }).catch(() => {});
  }, [conversationId, userId, userName]);

  return (
    <ChatContext.Provider value={{ userId, userName, userAvatar, isJoined, joinError, conversationId, messages, typingUsers, onlineCount, presence, settings, join, leave, sendMessage, setTyping }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
