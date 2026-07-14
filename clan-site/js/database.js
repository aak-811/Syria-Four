const API_BASE = '/api';

const DB = {
  async request(method, url, data) {
    const opts = {
      method,
      headers: {},
    };
    if (data && !(data instanceof FormData)) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      opts.body = data;
    }
    try {
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`API Error: ${method} ${url}`, err);
      throw err;
    }
  },

  get(url) { return this.request('GET', url); },
  post(url, data) { return this.request('POST', url, data); },
  put(url, data) { return this.request('PUT', url, data); },
  delete(url) { return this.request('DELETE', url); },

  getMembers() { return this.get(`${API_BASE}/members`); },
  addMember(data) { return this.post(`${API_BASE}/members`, data); },
  updateMember(id, data) { return this.put(`${API_BASE}/members/${id}`, data); },
  deleteMember(id) { return this.delete(`${API_BASE}/members/${id}`); },

  getTournaments() { return this.get(`${API_BASE}/tournaments`); },
  addTournament(data) { return this.post(`${API_BASE}/tournaments`, data); },
  deleteTournament(id) { return this.delete(`${API_BASE}/tournaments/${id}`); },

  getEvents() { return this.get(`${API_BASE}/events`); },
  addEvent(data) { return this.post(`${API_BASE}/events`, data); },
  deleteEvent(id) { return this.delete(`${API_BASE}/events/${id}`); },

  getLeaderboard() { return this.get(`${API_BASE}/leaderboard`); },
  addLeaderboardEntry(data) { return this.post(`${API_BASE}/leaderboard`, data); },
  updateLeaderboardEntry(id, data) { return this.put(`${API_BASE}/leaderboard/${id}`, data); },
  deleteLeaderboardEntry(id) { return this.delete(`${API_BASE}/leaderboard/${id}`); },

  getOrders() { return this.get(`${API_BASE}/orders`); },
  addOrder(data) { return this.post(`${API_BASE}/orders`, data); },
  updateOrderStatus(id) { return this.put(`${API_BASE}/orders/${id}`, { status: 'done' }); },
  deleteOrder(id) { return this.delete(`${API_BASE}/orders/${id}`); },

  getInstagramAccounts() { return this.get(`${API_BASE}/instagram`); },
  addInstagramAccount(data) { return this.post(`${API_BASE}/instagram`, data); },
  updateInstagramAccount(id, data) { return this.put(`${API_BASE}/instagram/${id}`, data); },
  deleteInstagramAccount(id) { return this.delete(`${API_BASE}/instagram/${id}`); },

  getSupportRequests() { return this.get(`${API_BASE}/support`); },
  addSupportRequest(data) { return this.post(`${API_BASE}/support`, data); },
  markSupportRead(id) { return this.put(`${API_BASE}/support/${id}`, { status: 'read' }); },
  deleteSupportRequest(id) { return this.delete(`${API_BASE}/support/${id}`); },

  getGalleryImages() { return this.get(`${API_BASE}/gallery`); },
  addGalleryImage(data) { return this.post(`${API_BASE}/gallery`, data); },
  deleteGalleryImage(id) { return this.delete(`${API_BASE}/gallery/${id}`); },

  getVideos() { return this.get(`${API_BASE}/videos`); },
  addVideo(data) { return this.post(`${API_BASE}/videos`, data); },
  deleteVideo(id) { return this.delete(`${API_BASE}/videos/${id}`); },

  getNotifications() { return this.get(`${API_BASE}/notifications`); },
  addNotification(data) { return this.post(`${API_BASE}/notifications`, data); },
  updateNotification(id, data) { return this.put(`${API_BASE}/notifications/${id}`, data); },
  deleteNotification(id) { return this.delete(`${API_BASE}/notifications/${id}`); },

  getPlayers() { return this.get(`${API_BASE}/players`); },
  addPlayer(data) { return this.post(`${API_BASE}/players`, data); },
  updatePlayer(slug, data) { return this.put(`${API_BASE}/players/${slug}`, data); },
  deletePlayer(slug) { return this.delete(`${API_BASE}/players/${slug}`); },
  getPlayerBySlug(slug) { return this.get(`${API_BASE}/players/slug/${slug}`); },

  getRequests() { return this.get(`${API_BASE}/requests`); },
  addRequest(data) { return this.post(`${API_BASE}/requests`, data); },
  updateRequest(id, data) { return this.put(`${API_BASE}/requests/${id}`, data); },
  deleteRequest(id) { return this.delete(`${API_BASE}/requests/${id}`); },
  updateTournament(id, data) { return this.put(`${API_BASE}/tournaments/${id}`, data); },

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post(`${API_BASE}/upload`, formData);
  },

  uploadPlayerFile(slug, type, file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post(`${API_BASE}/players/upload/${slug}/${type}`, formData);
  }
};
