const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeCollection(collection, data) {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf8');
}

const DB = {
  getAll(collection) {
    return readCollection(collection);
  },

  getById(collection, id) {
    const items = readCollection(collection);
    return items.find(item => item.id === id) || null;
  },

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

  getMembers() { return DB.getAll('members'); },
  addMember(data) { return DB.add('members', data); },
  updateMember(id, data) { return DB.update('members', id, data); },
  deleteMember(id) { return DB.delete('members', id); },

  getTournaments() { return DB.getAll('tournaments'); },
  addTournament(data) { return DB.add('tournaments', data); },
  deleteTournament(id) { return DB.delete('tournaments', id); },

  getEvents() { return DB.getAll('events'); },
  addEvent(data) { return DB.add('events', data); },
  deleteEvent(id) { return DB.delete('events', id); },

  getLeaderboard() { return DB.getAll('leaderboard'); },
  addLeaderboardEntry(data) { return DB.add('leaderboard', data); },
  updateLeaderboardEntry(id, data) { return DB.update('leaderboard', id, data); },
  deleteLeaderboardEntry(id) { return DB.delete('leaderboard', id); },

  getOrders() { return DB.getAll('orders'); },
  addOrder(data) { return DB.add('orders', data); },
  updateOrderStatus(id, status) { return DB.update('orders', id, { status }); },
  deleteOrder(id) { return DB.delete('orders', id); },

  getInstagramAccounts() { return DB.getAll('instagram'); },
  addInstagramAccount(data) { return DB.add('instagram', data); },
  updateInstagramAccount(id, data) { return DB.update('instagram', id, data); },
  deleteInstagramAccount(id) { return DB.delete('instagram', id); },

  getSupportRequests() { return DB.getAll('support'); },
  addSupportRequest(data) { return DB.add('support', data); },
  markSupportRead(id) { return DB.update('support', id, { status: 'read' }); },
  deleteSupportRequest(id) { return DB.delete('support', id); },

  getGalleryImages() { return DB.getAll('gallery'); },
  addGalleryImage(data) { return DB.add('gallery', data); },
  deleteGalleryImage(id) { return DB.delete('gallery', id); },

  getVideos() { return DB.getAll('videos'); },
  addVideo(data) { return DB.add('videos', data); },
  deleteVideo(id) { return DB.delete('videos', id); },

  getNotifications() { return DB.getAll('notifications'); },
  addNotification(data) { return DB.add('notifications', data); },
  setNotification(id, data) { return DB.update('notifications', id, data); },
  deleteNotification(id) { return DB.delete('notifications', id); },

  getPlayers() { return DB.getAll('players'); },
  addPlayer(data) {
    const slug = data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'player-' + Date.now()
      : 'player-' + Date.now();
    return DB.add('players', { ...data, slug });
  },
  getPlayerBySlug(slug) {
    const players = DB.getAll('players');
    return players.find(p => p.slug === slug) || null;
  },
  updatePlayer(slug, data) {
    const players = DB.getAll('players');
    const index = players.findIndex(p => p.slug === slug);
    if (index === -1) return null;
    players[index] = { ...players[index], ...data };
    writeCollection('players', players);
    return players[index];
  },
  deletePlayer(slug) {
    const players = DB.getAll('players');
    const index = players.findIndex(p => p.slug === slug);
    if (index === -1) return false;
    players.splice(index, 1);
    writeCollection('players', players);
    return true;
  }
};

module.exports = DB;
