export interface Conversation {
  id: string;
  type: "private" | "group";
  name: string;
  description?: string;
  image?: string;
  createdBy?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageSender?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  created_at?: string;
  members?: ConversationMember[];
}

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt?: string;
  lastReadAt?: string;
  isMuted?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file" | "gif" | "sticker" | "voice" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  replyTo?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedFor?: string[];
  reactions?: Record<string, string[]>;
  status: "sending" | "sent" | "delivered" | "seen";
  created_at: string;
}

export interface TypingUser {
  conversationId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface UserPresence {
  userId: string;
  username: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}
