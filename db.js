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
  updateTournament(id, d) { return fileDB.update('tournaments', id, d); },
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

// --- Auth/User methods for fileDB ---
fileDB.createUser = function(data) {
  const users = readCollection('users');
  const existingEmail = users.find(u => u.email === data.email);
  if (existingEmail) throw new Error('البريد الإلكتروني مستخدم بالفعل');
  const existingUsername = users.find(u => u.username === data.username);
  if (existingUsername) throw new Error('اسم المستخدم مستخدم بالفعل');
  const newUser = { id: uuidv4(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  users.push(newUser);
  writeCollection('users', users);
  return newUser;
};
fileDB.getUserByEmail = function(email) {
  return readCollection('users').find(u => u.email === email) || null;
};
fileDB.getUserByUsername = function(username) {
  return readCollection('users').find(u => u.username === username) || null;
};
fileDB.getUserById = function(id) {
  return readCollection('users').find(u => u.id === id) || null;
};
fileDB.updateUser = function(id, updates) {
  const users = readCollection('users');
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  if (updates.email && updates.email !== users[idx].email) {
    const dup = users.find(u => u.email === updates.email && u.id !== id);
    if (dup) throw new Error('البريد الإلكتروني مستخدم بالفعل');
  }
  if (updates.username && updates.username !== users[idx].username) {
    const dup = users.find(u => u.username === updates.username && u.id !== id);
    if (dup) throw new Error('اسم المستخدم مستخدم بالفعل');
  }
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
  writeCollection('users', users);
  return users[idx];
};
fileDB.deleteUser = function(id) {
  const users = readCollection('users');
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  writeCollection('users', users);
  return true;
};
fileDB.getAllUsers = function() {
  return readCollection('users');
};

// Sessions
fileDB.createSession = function(data) {
  return fileDB.add('sessions', data);
};
fileDB.getUserSessions = function(userId) {
  return readCollection('sessions').filter(s => s.userId === userId);
};
fileDB.getSessionByToken = function(token) {
  return readCollection('sessions').find(s => s.token === token) || null;
};
fileDB.deleteSession = function(id) {
  return fileDB.delete('sessions', id);
};
fileDB.deleteUserSessions = function(userId, excludeId) {
  const sessions = readCollection('sessions');
  const filtered = sessions.filter(s => s.userId === userId && s.id !== excludeId);
  writeCollection('sessions', filtered);
  return true;
};

// Audit Log
fileDB.addAuditLog = function(data) {
  return fileDB.add('audit_logs', data);
};
fileDB.getAuditLogs = function(userId) {
  const logs = readCollection('audit_logs');
  if (userId) return logs.filter(l => l.userId === userId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  return logs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
};


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

let checkAttempts = 0;
async function checkTables() {
  if (checkedTables) return tablesExist;
  checkAttempts++;
  if (!pgPool) { console.log('No DATABASE_URL configured. Using local JSON storage.'); checkedTables = true; return false; }
  try {
    const res = await pgPool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members')");
    tablesExist = res.rows[0].exists;
    if (tablesExist) {
      console.log('Supabase tables detected. Using Supabase storage.');
      checkedTables = true;
    } else if (checkAttempts < 3) {
      console.log('Supabase tables not found (attempt ' + checkAttempts + '/3). Retrying in 2s...');
      await new Promise(r => setTimeout(r, 2000));
      return checkTables();
    } else {
      console.log('Supabase tables not found after 3 attempts. Using local JSON storage.');
      console.log('Run: npm run setup');
      checkedTables = true;
    }
  } catch (err) {
    console.log('DB connection error (attempt ' + checkAttempts + '/3):', err.message);
    if (checkAttempts < 3) {
      await new Promise(r => setTimeout(r, 2000));
      return checkTables();
    }
    tablesExist = false;
    checkedTables = true;
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
['members','tournaments','events','leaderboard','orders','support','instagram','gallery','videos','notifications','players','users','sessions','audit_logs','awards','vip','hall-of-fame','conversations','conversation_members','messages','message_reads','typing_status','user_presence','blocked_users','pinned_messages','deleted_messages','chat_settings'].forEach(c => { sb[c] = sbCol(c); });

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
  updateTournament(id, d) { return sb.tournaments.update(id, d); },
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

  // Auth/User methods for supabase
  createUser(data) { return sb.users.add(data); },
  getUserByEmail(email) { return supabaseClient.from('users').select('*').eq('email', email).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  getUserByUsername(username) { return supabaseClient.from('users').select('*').eq('username', username).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  getUserById(id) { return supabaseClient.from('users').select('*').eq('id', id).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  updateUser(id, data) { return sb.users.update(id, data); },
  deleteUser(id) { return sb.users.delete(id); },
  getAllUsers() { return supabaseClient.from('users').select('*').order('createdAt', { ascending: false }).then(r => { if (r.error) throw r.error; return r.data || []; }); },
  createSession(data) { return sb.sessions.add(data); },
  getUserSessions(userId) { return supabaseClient.from('sessions').select('*').eq('userId', userId).order('lastActivity', { ascending: false }).then(r => { if (r.error) throw r.error; return r.data || []; }); },
  getSessionByToken(token) { return supabaseClient.from('sessions').select('*').eq('token', token).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  deleteSession(id) { return sb.sessions.delete(id); },
  deleteUserSessions(userId, excludeId) { return supabaseClient.from('sessions').delete().eq('userId', userId).neq('id', excludeId).then(r => { if (r.error) throw r.error; return true; }); },
  addAuditLog(data) { return sb.audit_logs.add(data); },
  getAuditLogs(userId) {
    let query = supabaseClient.from('audit_logs').select('*').order('createdAt', { ascending: false });
    if (userId) query = query.eq('userId', userId);
    return query.then(r => { if (r.error) throw r.error; return r.data || []; });
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
  updateTournament: rw((id, d) => supabaseDB.updateTournament(id, d), (id, d) => fileDB.updateTournament(id, d)),
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

  // Auth/User
  createUser: rw(d => supabaseDB.createUser(d), d => fileDB.createUser(d)),
  getUserByEmail: ar(email => supabaseDB.getUserByEmail(email), email => fileDB.getUserByEmail(email)),
  getUserByUsername: ar(username => supabaseDB.getUserByUsername(username), username => fileDB.getUserByUsername(username)),
  getUserById: ar(id => supabaseDB.getUserById(id), id => fileDB.getUserById(id)),
  updateUser: rw((id, d) => supabaseDB.updateUser(id, d), (id, d) => fileDB.updateUser(id, d)),
  deleteUser: rw(id => supabaseDB.deleteUser(id), id => fileDB.deleteUser(id)),
  getAllUsers: ar(() => supabaseDB.getAllUsers(), () => fileDB.getAllUsers()),

  createSession: rw(d => supabaseDB.createSession(d), d => fileDB.createSession(d)),
  getUserSessions: ar(userId => supabaseDB.getUserSessions(userId), userId => fileDB.getUserSessions(userId)),
  getSessionByToken: ar(token => supabaseDB.getSessionByToken(token), token => fileDB.getSessionByToken(token)),
  deleteSession: rw(id => supabaseDB.deleteSession(id), id => fileDB.deleteSession(id)),
  deleteUserSessions: rw((userId, excludeId) => supabaseDB.deleteUserSessions(userId, excludeId), (userId, excludeId) => fileDB.deleteUserSessions(userId, excludeId)),

  addAuditLog: rw(d => supabaseDB.addAuditLog(d), d => fileDB.addAuditLog(d)),
  getAuditLogs: ar(userId => supabaseDB.getAuditLogs(userId), userId => fileDB.getAuditLogs(userId)),
};

// ==============================
// Chat DB Methods
// ==============================

// File-based chat methods
fileDB.createConversation = function(data) { return fileDB.add('conversations', data); };
fileDB.getConversations = function() { return readCollection('conversations'); };
fileDB.getConversation = function(id) { return fileDB.getById('conversations', id); };
fileDB.updateConversation = function(id, d) { return fileDB.update('conversations', id, d); };
fileDB.deleteConversation = function(id) { return fileDB.delete('conversations', id); };

fileDB.addConversationMember = function(data) { return fileDB.add('conversation_members', data); };
fileDB.getConversationMembers = function(convId) { return readCollection('conversation_members').filter(m => m.conversationId === convId); };
fileDB.removeConversationMember = function(id) { return fileDB.delete('conversation_members', id); };
fileDB.getUserConversations = function(userId) { return readCollection('conversation_members').filter(m => m.userId === userId); };

fileDB.createMessage = function(data) { return fileDB.add('messages', data); };
fileDB.getMessages = function(convId) {
  return readCollection('messages').filter(m => m.conversationId === convId && !m.isDeleted).sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
};
fileDB.getMessage = function(id) { return fileDB.getById('messages', id); };
fileDB.updateMessage = function(id, d) { return fileDB.update('messages', id, d); };
fileDB.deleteMessage = function(id) { return fileDB.delete('messages', id); };

fileDB.addMessageRead = function(data) { return fileDB.add('message_reads', data); };
fileDB.getMessageReads = function(msgId) { return readCollection('message_reads').filter(r => r.messageId === msgId); };

fileDB.setTypingStatus = function(data) { 
  const items = readCollection('typing_status');
  const idx = items.findIndex(t => t.conversationId === data.conversationId && t.userId === data.userId);
  if (idx >= 0) { items[idx] = { ...items[idx], ...data }; writeCollection('typing_status', items); return items[idx]; }
  return fileDB.add('typing_status', data);
};
fileDB.getTypingUsers = function(convId) { return readCollection('typing_status').filter(t => t.conversationId === convId && t.isTyping); };

fileDB.setUserPresence = function(data) {
  const items = readCollection('user_presence');
  const idx = items.findIndex(u => u.userId === data.userId);
  if (idx >= 0) { items[idx] = { ...items[idx], ...data }; writeCollection('user_presence', items); return items[idx]; }
  return fileDB.add('user_presence', data);
};
fileDB.getUserPresence = function(userId) { return readCollection('user_presence').find(u => u.userId === userId) || null; };
fileDB.getAllPresence = function() { return readCollection('user_presence'); };

fileDB.blockUser = function(data) { return fileDB.add('blocked_users', data); };
fileDB.unblockUser = function(userId, blockedId) {
  const items = readCollection('blocked_users');
  const idx = items.findIndex(b => b.userId === userId && b.blockedUserId === blockedId);
  if (idx === -1) return false;
  items.splice(idx, 1);
  writeCollection('blocked_users', items);
  return true;
};
fileDB.getBlockedUsers = function(userId) { return readCollection('blocked_users').filter(b => b.userId === userId); };

fileDB.getChatUsers = function() {
  const presence = readCollection('user_presence');
  const msgs = readCollection('messages');
  const seen = new Set();
  presence.forEach(u => { seen.add(u.userId); });
  msgs.forEach(m => { if (m.senderId && !seen.has(m.senderId)) { seen.add(m.senderId); presence.push({ userId: m.senderId, username: m.senderName || '', avatarUrl: m.senderAvatar || '', status: 'offline' }); } });
  return presence;
};
fileDB.updateChatUser = function(userId, data) {
  const items = readCollection('user_presence');
  const idx = items.findIndex(u => u.userId === userId);
  if (idx >= 0) { items[idx] = { ...items[idx], ...data }; writeCollection('user_presence', items); return items[idx]; }
  return fileDB.add('user_presence', { userId, username: data.username || '', avatarUrl: data.avatarUrl || '', status: 'offline', ...data });
};

fileDB.getChatSettings = function() { const items = readCollection('chat_settings'); return items.length > 0 ? items[0] : {}; };
fileDB.updateChatSettings = function(data) {
  const items = readCollection('chat_settings');
  if (items.length > 0) { items[0] = { ...items[0], ...data }; writeCollection('chat_settings', items); return items[0]; }
  return fileDB.add('chat_settings', data);
};

// Supabase chat methods
const supabaseChat = {
  createConversation(data) { return sb.conversations.add(data); },
  getConversations() { return sb.conversations.getAll(); },
  getConversation(id) { return supabaseClient.from('conversations').select('*').eq('id', id).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  updateConversation(id, d) { return sb.conversations.update(id, d); },
  deleteConversation(id) { return sb.conversations.delete(id); },

  addConversationMember(data) { return sb.conversation_members.add(data); },
  getConversationMembers(convId) { return supabaseClient.from('conversation_members').select('*').eq('conversationId', convId).then(r => { if (r.error) throw r.error; return r.data || []; }); },
  removeConversationMember(id) { return sb.conversation_members.delete(id); },
  getUserConversations(userId) { return supabaseClient.from('conversation_members').select('*').eq('userId', userId).then(r => { if (r.error) throw r.error; return r.data || []; }); },

  createMessage(data) { return sb.messages.add(data); },
  getMessages(convId) {
    return supabaseClient.from('messages').select('*').eq('conversationId', convId).eq('isDeleted', false).order('created_at', { ascending: true }).then(r => { if (r.error) throw r.error; return r.data || []; });
  },
  getMessage(id) { return supabaseClient.from('messages').select('*').eq('id', id).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  updateMessage(id, d) { return sb.messages.update(id, d); },
  deleteMessage(id) { return sb.messages.delete(id); },

  addMessageRead(data) { return sb.message_reads.add(data); },
  getMessageReads(msgId) { return supabaseClient.from('message_reads').select('*').eq('messageId', msgId).then(r => { if (r.error) throw r.error; return r.data || []; }); },

  setTypingStatus(data) {
    return supabaseClient.from('typing_status').upsert(data, { onConflict: 'conversationId,userId' }).select().single().then(r => { if (r.error) throw r.error; return r.data; });
  },
  getTypingUsers(convId) { return supabaseClient.from('typing_status').select('*').eq('conversationId', convId).eq('isTyping', true).then(r => { if (r.error) throw r.error; return r.data || []; }); },

  setUserPresence(data) {
    return supabaseClient.from('user_presence').upsert(data, { onConflict: 'userId' }).select().single().then(r => { if (r.error) throw r.error; return r.data; });
  },
  getUserPresence(userId) { return supabaseClient.from('user_presence').select('*').eq('userId', userId).single().then(r => { if (r.error && r.error.code !== 'PGRST116') throw r.error; return r.data || null; }); },
  getAllPresence() { return supabaseClient.from('user_presence').select('*').then(r => { if (r.error) throw r.error; return r.data || []; }); },

  blockUser(data) { return sb.blocked_users.add(data); },
  unblockUser(userId, blockedId) { return supabaseClient.from('blocked_users').delete().eq('userId', userId).eq('blockedUserId', blockedId).then(r => { if (r.error) throw r.error; return true; }); },
  getBlockedUsers(userId) { return supabaseClient.from('blocked_users').select('*').eq('userId', userId).then(r => { if (r.error) throw r.error; return r.data || []; }); },

  getChatUsers() { return supabaseClient.from('user_presence').select('*').then(r => { if (r.error) throw r.error; return r.data || []; }); },
  updateChatUser(userId, data) {
    return supabaseClient.from('user_presence').upsert({ userId, ...data }, { onConflict: 'userId' }).select().single().then(r => { if (r.error) throw r.error; return r.data; });
  },
  getChatSettings() { return supabaseClient.from('chat_settings').select('*').limit(1).then(r => { if (r.error) throw r.error; return (r.data || [])[0] || {}; }); },
  updateChatSettings(data) { return supabaseClient.from('chat_settings').upsert(data, { onConflict: 'id' }).select().single().then(r => { if (r.error) throw r.error; return r.data; }); },
};

// Smart DB wrappers for chat
DB.createConversation = rw(d => supabaseChat.createConversation(d), d => fileDB.createConversation(d));
DB.getConversations = ar(() => supabaseChat.getConversations(), () => fileDB.getConversations());
DB.getConversation = ar(id => supabaseChat.getConversation(id), id => fileDB.getConversation(id));
DB.updateConversation = rw((id, d) => supabaseChat.updateConversation(id, d), (id, d) => fileDB.updateConversation(id, d));
DB.deleteConversation = rw(id => supabaseChat.deleteConversation(id), id => fileDB.deleteConversation(id));

DB.addConversationMember = rw(d => supabaseChat.addConversationMember(d), d => fileDB.addConversationMember(d));
DB.getConversationMembers = ar(convId => supabaseChat.getConversationMembers(convId), convId => fileDB.getConversationMembers(convId));
DB.removeConversationMember = rw(id => supabaseChat.removeConversationMember(id), id => fileDB.removeConversationMember(id));
DB.getUserConversations = ar(userId => supabaseChat.getUserConversations(userId), userId => fileDB.getUserConversations(userId));

DB.createMessage = rw(d => supabaseChat.createMessage(d), d => fileDB.createMessage(d));
DB.getMessages = ar(convId => supabaseChat.getMessages(convId), convId => fileDB.getMessages(convId));
DB.getMessage = ar(id => supabaseChat.getMessage(id), id => fileDB.getMessage(id));
DB.updateMessage = rw((id, d) => supabaseChat.updateMessage(id, d), (id, d) => fileDB.updateMessage(id, d));
DB.deleteMessage = rw(id => supabaseChat.deleteMessage(id), id => fileDB.deleteMessage(id));

DB.addMessageRead = rw(d => supabaseChat.addMessageRead(d), d => fileDB.addMessageRead(d));
DB.getMessageReads = ar(msgId => supabaseChat.getMessageReads(msgId), msgId => fileDB.getMessageReads(msgId));

DB.setTypingStatus = rw(d => supabaseChat.setTypingStatus(d), d => fileDB.setTypingStatus(d));
DB.getTypingUsers = ar(convId => supabaseChat.getTypingUsers(convId), convId => fileDB.getTypingUsers(convId));

DB.setUserPresence = rw(d => supabaseChat.setUserPresence(d), d => fileDB.setUserPresence(d));
DB.getUserPresence = ar(userId => supabaseChat.getUserPresence(userId), userId => fileDB.getUserPresence(userId));
DB.getAllPresence = ar(() => supabaseChat.getAllPresence(), () => fileDB.getAllPresence());

DB.blockUser = rw(d => supabaseChat.blockUser(d), d => fileDB.blockUser(d));
DB.unblockUser = rw((userId, blockedId) => supabaseChat.unblockUser(userId, blockedId), (userId, blockedId) => fileDB.unblockUser(userId, blockedId));
DB.getBlockedUsers = ar(userId => supabaseChat.getBlockedUsers(userId), userId => fileDB.getBlockedUsers(userId));

DB.getChatUsers = ar(() => supabaseChat.getChatUsers(), () => fileDB.getChatUsers());
DB.updateChatUser = rw((userId, data) => supabaseChat.updateChatUser(userId, data), (userId, data) => fileDB.updateChatUser(userId, data));
DB.getChatSettings = ar(() => supabaseChat.getChatSettings(), () => fileDB.getChatSettings());
DB.updateChatSettings = rw(data => supabaseChat.updateChatSettings(data), data => fileDB.updateChatSettings(data));

// Upload to Supabase Storage
DB.uploadChatFile = async (fileBuffer, fileName, mimeType) => {
  if (await sbReady() && supabaseClient) {
    const ext = fileName.split('.').pop() || 'bin';
    const key = `chat/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data } = await supabaseClient.storage.from('chat-uploads').upload(key, fileBuffer, { contentType: mimeType });
    if (data) {
      const { data: { publicUrl } } = supabaseClient.storage.from('chat-uploads').getPublicUrl(key);
      return { url: publicUrl, key };
    }
  }
  return { url: '', key: '' };
};

// --- Per-member Chat Settings ---
fileDB.getMemberChatSettings = function(id) {
  const member = readCollection('members').find(m => m.id === id);
  if (!member) return null;
  return {
    ownBubbleBg: member.chatOwnBubbleBg || '#005C4B', ownBubbleText: member.chatOwnBubbleText || '#FFFFFF',
    otherBubbleBg: member.chatOtherBubbleBg || '#1A1A2E', otherBubbleText: member.chatOtherBubbleText || '#FFFFFF',
    chatBg: member.chatBg || '#0A0A1A', headerBg: member.chatHeaderBg || '#0D0D20',
    inputBg: member.chatInputBg || '#1A1A2E', accentColor: member.chatAccentColor || '#00E5FF',
  };
};
fileDB.getMemberChatSettingsByName = function(chatName) {
  const member = readCollection('members').find(m => m.chatName === chatName);
  return member ? fileDB.getMemberChatSettings(member.id) : null;
};
fileDB.updateMemberChatSettings = function(id, data) {
  return fileDB.update('members', id, {
    chatOwnBubbleBg: data.ownBubbleBg, chatOwnBubbleText: data.ownBubbleText,
    chatOtherBubbleBg: data.otherBubbleBg, chatOtherBubbleText: data.otherBubbleText,
    chatBg: data.chatBg, chatHeaderBg: data.headerBg,
    chatInputBg: data.inputBg, chatAccentColor: data.accentColor,
  });
};

// Supabase per-member chat settings
const supabaseMemberSettings = {
  get(id) {
    return supabaseClient.from('members').select('*').eq('id', id).single().then(r => {
      if (r.error && r.error.code !== 'PGRST116') throw r.error;
      const m = r.data;
      if (!m) return null;
      return {
        ownBubbleBg: m.chatOwnBubbleBg || '#005C4B', ownBubbleText: m.chatOwnBubbleText || '#FFFFFF',
        otherBubbleBg: m.chatOtherBubbleBg || '#1A1A2E', otherBubbleText: m.chatOtherBubbleText || '#FFFFFF',
        chatBg: m.chatBg || '#0A0A1A', headerBg: m.chatHeaderBg || '#0D0D20',
        inputBg: m.chatInputBg || '#1A1A2E', accentColor: m.chatAccentColor || '#00E5FF',
      };
    });
  },
  getByName(chatName) {
    return supabaseClient.from('members').select('*').eq('chatName', chatName).single().then(r => {
      if (r.error && r.error.code !== 'PGRST116') throw r.error;
      const m = r.data;
      if (!m) return null;
      return {
        ownBubbleBg: m.chatOwnBubbleBg || '#005C4B', ownBubbleText: m.chatOwnBubbleText || '#FFFFFF',
        otherBubbleBg: m.chatOtherBubbleBg || '#1A1A2E', otherBubbleText: m.chatOtherBubbleText || '#FFFFFF',
        chatBg: m.chatBg || '#0A0A1A', headerBg: m.chatHeaderBg || '#0D0D20',
        inputBg: m.chatInputBg || '#1A1A2E', accentColor: m.chatAccentColor || '#00E5FF',
      };
    });
  },
  update(id, data) {
    return supabaseClient.from('members').update({
      chatOwnBubbleBg: data.ownBubbleBg, chatOwnBubbleText: data.ownBubbleText,
      chatOtherBubbleBg: data.otherBubbleBg, chatOtherBubbleText: data.otherBubbleText,
      chatBg: data.chatBg, chatHeaderBg: data.headerBg,
      chatInputBg: data.inputBg, chatAccentColor: data.accentColor,
    }).eq('id', id).select().single().then(r => { if (r.error) throw r.error; return r.data; });
  },
};

DB.getMemberChatSettings = ar(id => supabaseMemberSettings.get(id), id => fileDB.getMemberChatSettings(id));
DB.getMemberChatSettingsByName = ar(name => supabaseMemberSettings.getByName(name), name => fileDB.getMemberChatSettingsByName(name));
DB.updateMemberChatSettings = rw((id, data) => supabaseMemberSettings.update(id, data), (id, data) => fileDB.updateMemberChatSettings(id, data));

module.exports = DB;
