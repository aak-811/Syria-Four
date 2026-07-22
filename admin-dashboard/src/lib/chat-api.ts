const BASE = "";

async function req<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...opts?.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const chatApi = {
  // Join (name + password validation against member credentials)
  join: (name: string, password: string) => req<any>("/api/chat/join", { method: "POST", body: JSON.stringify({ name, password }) }),

  // Conversations
  getConversations: () => req<any[]>("/api/chat/conversations"),
  getConversation: (id: string) => req<any>(`/api/chat/conversations/${id}`),
  createConversation: (d: any) => req<any>("/api/chat/conversations", { method: "POST", body: JSON.stringify(d) }),
  updateConversation: (id: string, d: any) => req<any>(`/api/chat/conversations/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteConversation: (id: string) => req<any>(`/api/chat/conversations/${id}`, { method: "DELETE" }),

  // Members
  addMember: (convId: string, userId: string, role?: string) =>
    req<any>(`/api/chat/conversations/${convId}/members`, { method: "POST", body: JSON.stringify({ userId, role }) }),
  removeMember: (convId: string, userId: string) =>
    req<any>(`/api/chat/conversations/${convId}/members/${userId}`, { method: "DELETE" }),

  // Messages
  getMessages: (convId: string) => req<any[]>(`/api/chat/conversations/${convId}/messages`),
  sendMessage: (convId: string, d: any) =>
    req<any>(`/api/chat/conversations/${convId}/messages`, { method: "POST", body: JSON.stringify(d) }),
  updateMessage: (id: string, d: any) =>
    req<any>(`/api/chat/messages/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteMessage: (id: string, userId: string, forEveryone?: boolean) =>
    req<any>(`/api/chat/messages/${id}`, { method: "DELETE", body: JSON.stringify({ userId, forEveryone }) }),

  // Typing
  setTyping: (d: any) => req<any>("/api/chat/typing", { method: "POST", body: JSON.stringify(d) }),
  getTypingUsers: (convId: string) => req<any[]>(`/api/chat/typing/${convId}`),

  // Presence
  setPresence: (d: any) => req<any>("/api/chat/presence", { method: "POST", body: JSON.stringify(d) }),
  getPresence: () => req<any[]>("/api/chat/presence"),

  // Block
  blockUser: (userId: string, blockedUserId: string) =>
    req<any>("/api/chat/block", { method: "POST", body: JSON.stringify({ userId, blockedUserId }) }),
  unblockUser: (userId: string, blockedUserId: string) =>
    req<any>(`/api/chat/block/${userId}/${blockedUserId}`, { method: "DELETE" }),

  // Upload
  uploadFile: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch("/api/chat/upload", { method: "POST", body: fd }).then(r => r.json());
  },

  // Admin stats
  getChatStats: () => req<any>("/api/admin/chat/stats"),

  // Admin management
  getChatUsers: () => req<any[]>("/api/admin/chat/users"),
  updateChatUser: (userId: string, data: any) => req<any>(`/api/admin/chat/users/${userId}`, { method: "PUT", body: JSON.stringify(data) }),
  getChatSettings: () => req<any>("/api/admin/chat/settings"),
  updateChatSettings: (data: any) => req<any>("/api/admin/chat/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Per-member chat settings
  getMemberSettings: (memberId: string) => req<any>(`/api/chat/member-settings/${memberId}`),
  updateMemberSettings: (memberId: string, data: any) => req<any>(`/api/chat/member-settings/${memberId}`, { method: "PUT", body: JSON.stringify(data) }),
  getMySettings: (chatName: string) => req<any>(`/api/chat/my-settings?chatName=${encodeURIComponent(chatName)}`),
};
