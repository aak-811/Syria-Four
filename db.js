require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function createCollection(tableName) {
  return {
    async getAll() {
      const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getById(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },

    async add(item) {
      const newItem = { id: uuidv4(), ...item, created_at: new Date().toISOString() };
      const { data, error } = await supabase.from(tableName).insert(newItem).select().single();
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    }
  };
}

const collections = {};
const tableNames = [
  'members', 'tournaments', 'events', 'leaderboard',
  'orders', 'support', 'instagram', 'gallery', 'videos',
  'notifications', 'players'
];

tableNames.forEach(name => {
  collections[name] = createCollection(name);
});

const DB = {
  ...collections,

  getMembers() { return collections.members.getAll(); },
  addMember(data) { return collections.members.add(data); },
  updateMember(id, data) { return collections.members.update(id, data); },
  deleteMember(id) { return collections.members.delete(id); },

  getTournaments() { return collections.tournaments.getAll(); },
  addTournament(data) { return collections.tournaments.add(data); },
  deleteTournament(id) { return collections.tournaments.delete(id); },

  getEvents() { return collections.events.getAll(); },
  addEvent(data) { return collections.events.add(data); },
  deleteEvent(id) { return collections.events.delete(id); },

  getLeaderboard() { return collections.leaderboard.getAll(); },
  addLeaderboardEntry(data) { return collections.leaderboard.add(data); },
  updateLeaderboardEntry(id, data) { return collections.leaderboard.update(id, data); },
  deleteLeaderboardEntry(id) { return collections.leaderboard.delete(id); },

  getOrders() { return collections.orders.getAll(); },
  addOrder(data) { return collections.orders.add(data); },
  updateOrderStatus(id, status) { return collections.orders.update(id, { status }); },
  deleteOrder(id) { return collections.orders.delete(id); },

  getInstagramAccounts() { return collections.instagram.getAll(); },
  addInstagramAccount(data) { return collections.instagram.add(data); },
  updateInstagramAccount(id, data) { return collections.instagram.update(id, data); },
  deleteInstagramAccount(id) { return collections.instagram.delete(id); },

  getSupportRequests() { return collections.support.getAll(); },
  addSupportRequest(data) { return collections.support.add(data); },
  markSupportRead(id) { return collections.support.update(id, { status: 'read' }); },
  deleteSupportRequest(id) { return collections.support.delete(id); },

  getGalleryImages() { return collections.gallery.getAll(); },
  addGalleryImage(data) { return collections.gallery.add(data); },
  deleteGalleryImage(id) { return collections.gallery.delete(id); },

  getVideos() { return collections.videos.getAll(); },
  addVideo(data) { return collections.videos.add(data); },
  deleteVideo(id) { return collections.videos.delete(id); },

  getNotifications() { return collections.notifications.getAll(); },
  addNotification(data) { return collections.notifications.add(data); },
  updateNotification(id, data) { return collections.notifications.update(id, data); },
  deleteNotification(id) { return collections.notifications.delete(id); },

  getPlayers() { return collections.players.getAll(); },
  addPlayer(data) {
    const slug = data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'player-' + Date.now()
      : 'player-' + Date.now();
    return collections.players.add({ ...data, slug });
  },
  getPlayerBySlug(slug) {
    return supabase.from('players').select('*').eq('slug', slug).single().then(({ data, error }) => {
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    });
  },
  updatePlayer(slug, data) {
    return supabase.from('players').update(data).eq('slug', slug).select().single().then(({ data, error }) => {
      if (error) throw error;
      return data;
    });
  },
  deletePlayer(slug) {
    return supabase.from('players').delete().eq('slug', slug).then(({ error }) => {
      if (error) throw error;
      return true;
    });
  },

  getAll(collection) {
    return collections[collection]?.getAll() || Promise.resolve([]);
  },
  add(collection, data) {
    return collections[collection]?.add(data);
  },
  update(collection, id, data) {
    return collections[collection]?.update(id, data);
  },
  delete(collection, id) {
    return collections[collection]?.delete(id);
  }
};

module.exports = DB;
