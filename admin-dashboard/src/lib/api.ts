export const BASE_URL = "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Admin login
  adminLogin: (password: string) =>
    request<{ redirect: string }>("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  // Members
  getMembers: () => request<any[]>("/api/members"),
  addMember: (data: any) =>
    request<any>("/api/members", { method: "POST", body: JSON.stringify(data) }),
  updateMember: (id: string, data: any) =>
    request<any>(`/api/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMember: (id: string) =>
    request<any>(`/api/members/${id}`, { method: "DELETE" }),

  // Tournaments
  getTournaments: () => request<any[]>("/api/tournaments"),
  addTournament: (data: any) =>
    request<any>("/api/tournaments", { method: "POST", body: JSON.stringify(data) }),
  updateTournament: (id: string, data: any) =>
    request<any>(`/api/tournaments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTournament: (id: string) =>
    request<any>(`/api/tournaments/${id}`, { method: "DELETE" }),

  // Events
  getEvents: () => request<any[]>("/api/events"),
  addEvent: (data: any) =>
    request<any>("/api/events", { method: "POST", body: JSON.stringify(data) }),
  deleteEvent: (id: string) =>
    request<any>(`/api/events/${id}`, { method: "DELETE" }),

  // Leaderboard
  getLeaderboard: () => request<any[]>("/api/leaderboard"),
  addLeaderboardEntry: (data: any) =>
    request<any>("/api/leaderboard", { method: "POST", body: JSON.stringify(data) }),
  updateLeaderboardEntry: (id: string, data: any) =>
    request<any>(`/api/leaderboard/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteLeaderboardEntry: (id: string) =>
    request<any>(`/api/leaderboard/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request<any[]>("/api/orders"),
  updateOrder: (id: string, data: any) =>
    request<any>(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteOrder: (id: string) =>
    request<any>(`/api/orders/${id}`, { method: "DELETE" }),

  // Support
  getSupport: () => request<any[]>("/api/support"),
  addSupportRequest: (data: any) =>
    request<any>("/api/support", { method: "POST", body: JSON.stringify(data) }),
  updateSupport: (id: string, data: any) =>
    request<any>(`/api/support/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSupport: (id: string) =>
    request<any>(`/api/support/${id}`, { method: "DELETE" }),

  // Instagram
  getInstagram: () => request<any[]>("/api/instagram"),
  addInstagram: (data: any) =>
    request<any>("/api/instagram", { method: "POST", body: JSON.stringify(data) }),
  updateInstagram: (id: string, data: any) =>
    request<any>(`/api/instagram/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInstagram: (id: string) =>
    request<any>(`/api/instagram/${id}`, { method: "DELETE" }),

  // Gallery
  getGallery: () => request<any[]>("/api/gallery"),
  addGallery: (data: any) =>
    request<any>("/api/gallery", { method: "POST", body: JSON.stringify(data) }),
  deleteGallery: (id: string) =>
    request<any>(`/api/gallery/${id}`, { method: "DELETE" }),

  // Videos
  getVideos: () => request<any[]>("/api/videos"),
  addVideo: (data: any) =>
    request<any>("/api/videos", { method: "POST", body: JSON.stringify(data) }),
  deleteVideo: (id: string) =>
    request<any>(`/api/videos/${id}`, { method: "DELETE" }),

  // Notifications
  getNotifications: () => request<any[]>("/api/notifications"),
  addNotification: (data: any) =>
    request<any>("/api/notifications", { method: "POST", body: JSON.stringify(data) }),
  updateNotification: (id: string, data: any) =>
    request<any>(`/api/notifications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteNotification: (id: string) =>
    request<any>(`/api/notifications/${id}`, { method: "DELETE" }),

  // Requests
  getRequests: () => request<any[]>("/api/requests"),
  addRequest: (data: any) =>
    request<any>("/api/requests", { method: "POST", body: JSON.stringify(data) }),
  updateRequest: (id: string, data: any) =>
    request<any>(`/api/requests/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteRequest: (id: string) =>
    request<any>(`/api/requests/${id}`, { method: "DELETE" }),

  // Players
  getPlayers: () => request<any[]>("/api/players"),
  addPlayer: (data: any) =>
    request<any>("/api/players", { method: "POST", body: JSON.stringify(data) }),
  updatePlayer: (slug: string, data: any) =>
    request<any>(`/api/players/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePlayer: (slug: string) =>
    request<any>(`/api/players/${slug}`, { method: "DELETE" }),

  // File upload
  uploadFile: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch("/api/upload", { method: "POST", body: form }).then((r) => r.json());
  },
};
