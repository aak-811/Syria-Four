const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeCollection(collection, data) {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf8');
}

// --- File implementation (always available) ---

const fileDB = {
  getAll(collection) { return readCollection(collection); },
  getById(collection, id) { return readCollection(collection).find(item => item.id === id) || null; },
  add(collection, item) {
    const items = readCollection(collection);
    const newItem = { id: uuidv4(), ...item };
    items.push(newItem);
    writeCollection(collection, items);
    return newItem;
  },
  update(collection, id, updates) {
    const items = readCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    writeCollection(collection, items);
    return items[index];
  },
  delete(collection, id) {
    const items = readCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    writeCollection(collection, items);
    return true;
  },

  getMembers() { return fileDB.getAll('members'); },
  addMember(d) { return fileDB.add('members', d); },
  updateMember(id, d) { return fileDB.update('members', id, d); },
  deleteMember(id) { return fileDB.delete('members', id); },
  getTournaments() { return fileDB.getAll('tournaments'); },
  addTournament(d) { return fileDB.add('tournaments', d); },
  deleteTournament(id) { return fileDB.delete('tournaments', id); },
  getEvents() { return fileDB.getAll('events'); },
  addEvent(d) { return fileDB.add('events', d); },
  deleteEvent(id) { return fileDB.delete('events', id); },
  getLeaderboard() { return fileDB.getAll('leaderboard'); },
  addLeaderboardEntry(d) { return fileDB.add('leaderboard', d); },
  updateLeaderboardEntry(id, d) { return fileDB.update('leaderboard', id, d); },
  deleteLeaderboardEntry(id) { return fileDB.delete('leaderboard', id); },
  getOrders() { return fileDB.getAll('orders'); },
  addOrder(d) { return fileDB.add('orders', d); },
  updateOrderStatus(id, s) { return fileDB.update('orders', id, { status: s }); },
  deleteOrder(id) { return fileDB.delete('orders', id); },
  getInstagramAccounts() { return fileDB.getAll('instagram'); },
  addInstagramAccount(d) { return fileDB.add('instagram', d); },
  updateInstagramAccount(id, d) { return fileDB.update('instagram', id, d); },
  deleteInstagramAccount(id) { return fileDB.delete('instagram', id); },
  getSupportRequests() { return fileDB.getAll('support'); },
  addSupportRequest(d) { return fileDB.add('support', d); },
  markSupportRead(id) { return fileDB.update('support', id, { status: 'read' }); },
  deleteSupportRequest(id) { return fileDB.delete('support', id); },
  getGalleryImages() { return fileDB.getAll('gallery'); },
  addGalleryImage(d) { return fileDB.add('gallery', d); },
  deleteGalleryImage(id) { return fileDB.delete('gallery', id); },
  getVideos() { return fileDB.getAll('videos'); },
  addVideo(d) { return fileDB.add('videos', d); },
  deleteVideo(id) { return fileDB.delete('videos', id); },
  getNotifications() { return fileDB.getAll('notifications'); },
  addNotification(d) { return fileDB.add('notifications', d); },
  updateNotification(id, d) { return fileDB.update('notifications', id, d); },
  deleteNotification(id) { return fileDB.delete('notifications', id); },
  getPlayers() { return fileDB.getAll('players'); },
  addPlayer(data) {
    const slug = data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'player-' + Date.now()
      : 'player-' + Date.now();
    return fileDB.add('players', { ...data, slug });
  },
  getPlayerBySlug(slug) { return fileDB.getAll('players').find(p => p.slug === slug) || null; },
  updatePlayer(slug, data) {
    const players = fileDB.getAll('players');
    const idx = players.findIndex(p => p.slug === slug);
    if (idx === -1) return null;
    players[idx] = { ...players[idx], ...data };
    writeCollection('players', players);
    return players[idx];
  },
  deletePlayer(slug) {
    const players = fileDB.getAll('players');
    const idx = players.findIndex(p => p.slug === slug);
    if (idx === -1) return false;
    players.splice(idx, 1);
    writeCollection('players', players);
    return true;
  },
};

// --- Supabase setup (via pg for schema check) ---

let supabaseClient = null;
let pgPool = null;
let tablesExist = false;
let checkedTables = false;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.DATABASE_URL;

if (supabaseUrl && supabaseKey) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
}
if (dbUrl) {
  pgPool = new Pool({ connectionString: dbUrl, max: 1, connectionTimeoutMillis: 5000 });
}

async function checkTables() {
  if (checkedTables) return tablesExist;
  checkedTables = true;
  if (!pgPool) return false;
  try {
    const res = await pgPool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members')");
    tablesExist = res.rows[0].exists;
    if (!tablesExist) {
      console.log('Supabase tables not found. Using local JSON storage.');
      console.log('Run: npm run setup (after adding DATABASE_URL to .env)');
    } else {
      console.log('Supabase tables detected. Using Supabase storage.');
    }
  } catch (err) {
    console.log('Cannot connect to database:', err.message);
    tablesExist = false;
  }
  return tablesExist;
}

// --- Supabase collection helpers ---

function sbCol(tableName) {
  return {
    getAll() { return supabaseClient.from(tableName).select('*').order('created_at', { ascending: false }).then(r => { if (r.error) throw r.error; return r.data || []; }); },
    add(item) { return supabaseClient.from(tableName).insert({ id: uuidv4(), ...item, created_at: new Date().toISOString() }).select().single().then(r => { if (r.error) throw r.error; return r.data; }); },
    update(id, updates) { return supabaseClient.from(tableName).update(updates).eq('id', id).select().single().then(r => { if (r.error) throw r.error; return r.data; }); },
    delete(id) { return supabaseClient.from(tableName).delete().eq('id', id).then(r => { if (r.error) throw r.error; return true; }); },
  };
}

const sb = {};
['members','tournaments','events','leaderboard','orders','support','instagram','gallery','videos','notifications','players'].forEach(c => { sb[c] = sbCol(c); });

const supabaseDB = {
  getAll(c) { return sb[c].getAll(); },
  add(c, d) { return sb[c].add(d); },
  update(c, id, d) { return sb[c].update(id, d); },
  delete(c, id) { return sb[c].delete(id); },
  getMembers() { return sb.members.getAll(); },
  addMember(d) { return sb.members.add(d); },
  updateMember(id, d) { return sb.members.update(id, d); },
  deleteMember(id) { return sb.members.delete(id); },
  getTournaments() { return sb.tournaments.getAll(); },
  addTournament(d) { return sb.tournaments.add(d); },
  deleteTournament(id) { return sb.tournaments.delete(id); },
  getEvents() { return sb.events.getAll(); },
  addEvent(d) { return sb.events.add(d); },
  deleteEvent(id) { return sb.events.delete(id); },
  getLeaderboard() { return sb.leaderboard.getAll(); },
  addLeaderboardEntry(d) { return sb.leaderboard.add(d); },
  updateLeaderboardEntry(id, d) { return sb.leaderboard.update(id, d); },
  deleteLeaderboardEntry(id) { return sb.leaderboard.delete(id); },
  getOrders() { return sb.orders.getAll(); },
  addOrder(d) { return sb.orders.add(d); },
  updateOrderStatus(id, s) { return sb.orders.update(id, { status: s }); },
  deleteOrder(id) { return sb.orders.delete(id); },
  getInstagramAccounts() { return sb.instagram.getAll(); },
  addInstagramAccount(d) { return sb.instagram.add(d); },
  updateInstagramAccount(id, d) { return sb.instagram.update(id, d); },
  deleteInstagramAccount(id) { return sb.instagram.delete(id); },
  getSupportRequests() { return sb.support.getAll(); },
  addSupportRequest(d) { return sb.support.add(d); },
  markSupportRead(id) { return sb.support.update(id, { status: 'read' }); },
  deleteSupportRequest(id) { return sb.support.delete(id); },
  getGalleryImages() { return sb.gallery.getAll(); },
  addGalleryImage(d) { return sb.gallery.add(d); },
  deleteGalleryImage(id) { return sb.gallery.delete(id); },
  getVideos() { return sb.videos.getAll(); },
  addVideo(d) { return sb.videos.add(d); },
  deleteVideo(id) { return sb.videos.delete(id); },
  getNotifications() { return sb.notifications.getAll(); },
  addNotification(d) { return sb.notifications.add(d); },
  updateNotification(id, d) { return sb.notifications.update(id, d); },
  deleteNotification(id) { return sb.notifications.delete(id); },
  getPlayers() { return sb.players.getAll(); },
  addPlayer(data) {
    const slug = data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'player-' + Date.now()
      : 'player-' + Date.now();
    return sb.players.add({ ...data, slug });
  },
  getPlayerBySlug(slug) {
    return supabaseClient.from('players').select('*').eq('slug', slug).single().then(r => {
      if (r.error && r.error.code !== 'PGRST116') throw r.error;
      return r.data || null;
    });
  },
  updatePlayer(slug, data) {
    return supabaseClient.from('players').update(data).eq('slug', slug).select().single().then(r => {
      if (r.error) throw r.error;
      return r.data;
    });
  },
  deletePlayer(slug) {
    return supabaseClient.from('players').delete().eq('slug', slug).then(r => {
      if (r.error) throw r.error;
      return true;
    });
  },
};

// --- Smart DB: File always primary. Supabase syncs on writes when available ---

async function sbReady() {
  try { return await checkTables(); } catch { return false; }
}

async function trySync(operation) {
  if (await sbReady()) {
    try { return await operation(); } catch (e) { console.warn('Supabase sync error:', e.message); }
  }
}

// Helper: write to file, then sync to Supabase in background
function rw(supabaseFn, fileFn) {
  return (...args) => {
    const result = fileFn(...args);
    trySync(() => supabaseFn(...args));
    return result;
  };
}
// Async read: try Supabase first, fallback to file
function ar(supabaseFn, fileFn) {
  return (...args) => {
    const doRead = async () => {
      if (await sbReady()) {
        try { return await supabaseFn(...args); } catch (e) { console.warn('Supabase read error:', e.message); }
      }
      return fileFn(...args);
    };
    return doRead();
  };
}

const DB = {
  getAll: ar(c => supabaseDB.getAll(c), c => fileDB.getAll(c)),
  add: rw((c, d) => supabaseDB.add(c, d), (c, d) => fileDB.add(c, d)),
  update: rw((c, id, d) => supabaseDB.update(c, id, d), (c, id, d) => fileDB.update(c, id, d)),
  delete: rw((c, id) => supabaseDB.delete(c, id), (c, id) => fileDB.delete(c, id)),

  getMembers: ar(() => supabaseDB.getMembers(), () => fileDB.getMembers()),
  addMember: rw(d => supabaseDB.addMember(d), d => fileDB.addMember(d)),
  updateMember: rw((id, d) => supabaseDB.updateMember(id, d), (id, d) => fileDB.updateMember(id, d)),
  deleteMember: rw(id => supabaseDB.deleteMember(id), id => fileDB.deleteMember(id)),

  getTournaments: ar(() => supabaseDB.getTournaments(), () => fileDB.getTournaments()),
  addTournament: rw(d => supabaseDB.addTournament(d), d => fileDB.addTournament(d)),
  deleteTournament: rw(id => supabaseDB.deleteTournament(id), id => fileDB.deleteTournament(id)),

  getEvents: ar(() => supabaseDB.getEvents(), () => fileDB.getEvents()),
  addEvent: rw(d => supabaseDB.addEvent(d), d => fileDB.addEvent(d)),
  deleteEvent: rw(id => supabaseDB.deleteEvent(id), id => fileDB.deleteEvent(id)),

  getLeaderboard: ar(() => supabaseDB.getLeaderboard(), () => fileDB.getLeaderboard()),
  addLeaderboardEntry: rw(d => supabaseDB.addLeaderboardEntry(d), d => fileDB.addLeaderboardEntry(d)),
  updateLeaderboardEntry: rw((id, d) => supabaseDB.updateLeaderboardEntry(id, d), (id, d) => fileDB.updateLeaderboardEntry(id, d)),
  deleteLeaderboardEntry: rw(id => supabaseDB.deleteLeaderboardEntry(id), id => fileDB.deleteLeaderboardEntry(id)),

  getOrders: ar(() => supabaseDB.getOrders(), () => fileDB.getOrders()),
  addOrder: rw(d => supabaseDB.addOrder(d), d => fileDB.addOrder(d)),
  updateOrderStatus: rw((id, s) => supabaseDB.updateOrderStatus(id, s), (id, s) => fileDB.updateOrderStatus(id, s)),
  deleteOrder: rw(id => supabaseDB.deleteOrder(id), id => fileDB.deleteOrder(id)),

  getInstagramAccounts: ar(() => supabaseDB.getInstagramAccounts(), () => fileDB.getInstagramAccounts()),
  addInstagramAccount: rw(d => supabaseDB.addInstagramAccount(d), d => fileDB.addInstagramAccount(d)),
  updateInstagramAccount: rw((id, d) => supabaseDB.updateInstagramAccount(id, d), (id, d) => fileDB.updateInstagramAccount(id, d)),
  deleteInstagramAccount: rw(id => supabaseDB.deleteInstagramAccount(id), id => fileDB.deleteInstagramAccount(id)),

  getSupportRequests: ar(() => supabaseDB.getSupportRequests(), () => fileDB.getSupportRequests()),
  addSupportRequest: rw(d => supabaseDB.addSupportRequest(d), d => fileDB.addSupportRequest(d)),
  markSupportRead: rw(id => supabaseDB.markSupportRead(id), id => fileDB.markSupportRead(id)),
  deleteSupportRequest: rw(id => supabaseDB.deleteSupportRequest(id), id => fileDB.deleteSupportRequest(id)),

  getGalleryImages: ar(() => supabaseDB.getGalleryImages(), () => fileDB.getGalleryImages()),
  addGalleryImage: rw(d => supabaseDB.addGalleryImage(d), d => fileDB.addGalleryImage(d)),
  deleteGalleryImage: rw(id => supabaseDB.deleteGalleryImage(id), id => fileDB.deleteGalleryImage(id)),

  getVideos: ar(() => supabaseDB.getVideos(), () => fileDB.getVideos()),
  addVideo: rw(d => supabaseDB.addVideo(d), d => fileDB.addVideo(d)),
  deleteVideo: rw(id => supabaseDB.deleteVideo(id), id => fileDB.deleteVideo(id)),

  getNotifications: ar(() => supabaseDB.getNotifications(), () => fileDB.getNotifications()),
  addNotification: rw(d => supabaseDB.addNotification(d), d => fileDB.addNotification(d)),
  updateNotification: rw((id, d) => supabaseDB.updateNotification(id, d), (id, d) => fileDB.updateNotification(id, d)),
  deleteNotification: rw(id => supabaseDB.deleteNotification(id), id => fileDB.deleteNotification(id)),

  getPlayers: ar(() => supabaseDB.getPlayers(), () => fileDB.getPlayers()),
  addPlayer: rw(d => supabaseDB.addPlayer(d), d => fileDB.addPlayer(d)),
  getPlayerBySlug: ar(slug => supabaseDB.getPlayerBySlug(slug), slug => fileDB.getPlayerBySlug(slug)),
  updatePlayer: rw((slug, d) => supabaseDB.updatePlayer(slug, d), (slug, d) => fileDB.updatePlayer(slug, d)),
  deletePlayer: rw(slug => supabaseDB.deletePlayer(slug), slug => fileDB.deletePlayer(slug)),
};

module.exports = DB;
