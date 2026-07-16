const BASE = "";

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
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

export const api = {
  adminLogin: (password: string) =>
    request<{ redirect: string }>("/api/admin-login", { method: "POST", body: JSON.stringify({ password }) }),

  getMembers: () => request<any[]>("/api/members"),
  addMember: (d: any) => request<any>("/api/members", { method: "POST", body: JSON.stringify(d) }),
  updateMember: (id: string, d: any) => request<any>(`/api/members/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteMember: (id: string) => request<any>(`/api/members/${id}`, { method: "DELETE" }),

  getTournaments: () => request<any[]>("/api/tournaments"),
  addTournament: (d: any) => request<any>("/api/tournaments", { method: "POST", body: JSON.stringify(d) }),
  updateTournament: (id: string, d: any) => request<any>(`/api/tournaments/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteTournament: (id: string) => request<any>(`/api/tournaments/${id}`, { method: "DELETE" }),

  getEvents: () => request<any[]>("/api/events"),
  addEvent: (d: any) => request<any>("/api/events", { method: "POST", body: JSON.stringify(d) }),
  deleteEvent: (id: string) => request<any>(`/api/events/${id}`, { method: "DELETE" }),

  getLeaderboard: () => request<any[]>("/api/leaderboard"),
  addLeaderboardEntry: (d: any) => request<any>("/api/leaderboard", { method: "POST", body: JSON.stringify(d) }),
  updateLeaderboardEntry: (id: string, d: any) => request<any>(`/api/leaderboard/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteLeaderboardEntry: (id: string) => request<any>(`/api/leaderboard/${id}`, { method: "DELETE" }),

  getOrders: () => request<any[]>("/api/orders"),
  updateOrder: (id: string, d: any) => request<any>(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteOrder: (id: string) => request<any>(`/api/orders/${id}`, { method: "DELETE" }),

  getSupport: () => request<any[]>("/api/support"),
  addSupportRequest: (d: any) => request<any>("/api/support", { method: "POST", body: JSON.stringify(d) }),
  updateSupport: (id: string, d: any) => request<any>(`/api/support/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteSupport: (id: string) => request<any>(`/api/support/${id}`, { method: "DELETE" }),

  getInstagram: () => request<any[]>("/api/instagram"),
  addInstagram: (d: any) => request<any>("/api/instagram", { method: "POST", body: JSON.stringify(d) }),
  updateInstagram: (id: string, d: any) => request<any>(`/api/instagram/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteInstagram: (id: string) => request<any>(`/api/instagram/${id}`, { method: "DELETE" }),

  getGallery: () => request<any[]>("/api/gallery"),
  addGallery: (d: any) => request<any>("/api/gallery", { method: "POST", body: JSON.stringify(d) }),
  deleteGallery: (id: string) => request<any>(`/api/gallery/${id}`, { method: "DELETE" }),

  getVideos: () => request<any[]>("/api/videos"),
  addVideo: (d: any) => request<any>("/api/videos", { method: "POST", body: JSON.stringify(d) }),
  deleteVideo: (id: string) => request<any>(`/api/videos/${id}`, { method: "DELETE" }),

  getNotifications: () => request<any[]>("/api/notifications"),
  addNotification: (d: any) => request<any>("/api/notifications", { method: "POST", body: JSON.stringify(d) }),
  updateNotification: (id: string, d: any) => request<any>(`/api/notifications/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteNotification: (id: string) => request<any>(`/api/notifications/${id}`, { method: "DELETE" }),

  getRequests: () => request<any[]>("/api/requests"),
  addRequest: (d: any) => request<any>("/api/requests", { method: "POST", body: JSON.stringify(d) }),
  updateRequest: (id: string, d: any) => request<any>(`/api/requests/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteRequest: (id: string) => request<any>(`/api/requests/${id}`, { method: "DELETE" }),

  getUsers: () => request<{ users: any[] }>("/api/admin/users"),
  updateUser: (id: string, d: any) => request<any>(`/api/admin/users/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteUser: (id: string) => request<any>(`/api/admin/users/${id}`, { method: "DELETE" }),

  getAuditLogs: () => request<{ logs: any[] }>("/api/admin/audit-logs"),

  getPlayers: () => request<any[]>("/api/players"),
  addPlayer: (d: any) => request<any>("/api/players", { method: "POST", body: JSON.stringify(d) }),
  updatePlayer: (slug: string, d: any) => request<any>(`/api/players/${slug}`, { method: "PUT", body: JSON.stringify(d) }),
  deletePlayer: (slug: string) => request<any>(`/api/players/${slug}`, { method: "DELETE" }),

  uploadFile: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch("/api/upload", { method: "POST", body: fd }).then(r => r.json());
  },
};
