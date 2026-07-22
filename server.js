require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const DB = require('./db');
const { hashPassword, comparePassword, generateToken, authMiddleware } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Diagnostic endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabase: !!process.env.SUPABASE_URL,
    database: !!process.env.DATABASE_URL,
    dashboard: require('fs').existsSync(path.join(__dirname, 'admin-dashboard', 'out', 'index.html')),
  });
});

// Admin login redirect
app.post('/api/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === 'syria2026' || password === 'aak1qusai7' || password === 'Za3im1syria') {
    return res.json({ redirect: '/admin/' });
  }
  return res.status(401).json({ error: 'كلمة المرور خاطئة' });
});

// Serve Next.js dashboard (static export) at root /
const dashboardPath = path.join(__dirname, 'admin-dashboard', 'out');
const dashboardExists = fs.existsSync(path.join(dashboardPath, 'index.html'));
if (!dashboardExists) {
  console.warn('WARNING: Dashboard not built yet. Run: cd admin-dashboard && npm run build');
}

// Serve dashboard static assets (_next) first
if (dashboardExists) {
  app.use('/_next', express.static(path.join(dashboardPath, '_next')));
}

// Serve clan-site images and uploads
app.use('/images', express.static(path.join(__dirname, 'clan-site', 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'clan-site', 'uploads')));

// Serve dashboard page HTML files for all routes (must be after API routes)
function serveDashboard(req, res, next) {
  if (req.method !== 'GET') return next();
  if (!dashboardExists) return next();

  if (req.path === '/' || req.path === '') {
    return res.sendFile(path.join(dashboardPath, 'index.html'));
  }

  let filePath = req.path;
  if (filePath.endsWith('/') && filePath !== '/') filePath = filePath.slice(0, -1);

  if (filePath && filePath !== '/') {
    const pagePath = path.join(dashboardPath, filePath.slice(1), 'index.html');
    if (fs.existsSync(pagePath)) {
      return res.sendFile(pagePath);
    }
  }

  res.sendFile(path.join(dashboardPath, 'index.html'));
}

// Upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'clan-site', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadsDir = path.join(__dirname, 'clan-site', 'uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

function createRouter(collection) {
  const router = express.Router();
  router.get('/', async (req, res) => {
    try {
      const data = await DB.getAll(collection);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.post('/', async (req, res) => {
    try {
      const item = await DB.add(collection, req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.put('/:id', async (req, res) => {
    try {
      const item = await DB.update(collection, req.params.id, req.body);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await DB.delete(collection, req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  return router;
}

// --- Member-specific routes with duplicate chatName check ---
app.post('/api/members', async (req, res) => {
  try {
    const { chatName } = req.body;
    if (chatName) {
      const members = await DB.getMembers();
      if (members.some(m => m.chatName === chatName && m.id !== req.body.id)) {
        return res.status(400).json({ error: 'اسم المستخدم في الدردشة موجود مسبقاً' });
      }
    }
    const item = await DB.add('members', req.body);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/members/:id', async (req, res) => {
  try {
    const { chatName } = req.body;
    if (chatName) {
      const members = await DB.getMembers();
      if (members.some(m => m.chatName === chatName && m.id !== req.params.id)) {
        return res.status(400).json({ error: 'اسم المستخدم في الدردشة موجود مسبقاً' });
      }
    }
    const item = await DB.update('members', req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/members', createRouter('members'));
app.use('/api/tournaments', createRouter('tournaments'));
app.use('/api/events', createRouter('events'));
app.use('/api/leaderboard', createRouter('leaderboard'));
app.use('/api/orders', createRouter('orders'));
app.use('/api/support', createRouter('support'));
app.use('/api/instagram', createRouter('instagram'));
app.use('/api/gallery', createRouter('gallery'));
app.use('/api/videos', createRouter('videos'));
app.use('/api/notifications', createRouter('notifications'));
app.use('/api/requests', createRouter('requests'));
app.use('/api/awards', createRouter('awards'));
app.use('/api/vip', createRouter('vip'));
app.use('/api/hall-of-fame', createRouter('hall-of-fame'));

app.get('/api/players', async (req, res) => {
  try {
    const players = await DB.getPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/players', async (req, res) => {
  try {
    const player = await DB.addPlayer(req.body);
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/players/:slug', async (req, res) => {
  try {
    const player = await DB.updatePlayer(req.params.slug, req.body);
    if (!player) return res.status(404).json({ error: 'Not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/players/:slug', async (req, res) => {
  try {
    const deleted = await DB.deletePlayer(req.params.slug);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: '/uploads/' + req.file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/players/upload/:slug/:type', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = '/uploads/' + req.file.filename;
    const player = await DB.getPlayerBySlug(req.params.slug);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    const update = {};
    if (req.params.type === 'profile') update.profileImage = url;
    else if (req.params.type === 'gallery') {
      const gallery = player.gallery || [];
      gallery.push(url);
      update.gallery = gallery;
    }
    await DB.updatePlayer(req.params.slug, update);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/players/slug/:slug', async (req, res) => {
  try {
    const player = await DB.getPlayerBySlug(req.params.slug);
    if (!player) return res.status(404).json({ error: 'Not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Routes ---

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'طلبات كثيرة جداً، حاول بعد 15 دقيقة' } });
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) return res.status(400).json({ error: 'اسم المستخدم يجب أن يكون 3-30 حرفاً (أحرف، أرقام، _)' });

    const existingEmail = await DB.getUserByEmail(email);
    if (existingEmail) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
    const existingUsername = await DB.getUserByUsername(username);
    if (existingUsername) return res.status(409).json({ error: 'اسم المستخدم مستخدم بالفعل' });

    const hashed = await hashPassword(password);
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    const user = await DB.createUser({
      name, username, email, password: hashed,
      role: 'member', status: 'pending',
      verificationToken, verified: false,
      avatar: '', cover: '', bio: '', phone: '', country: '', age: '',
      instagram: '', discord: '', ffUid: '', ffIgn: '', ffServer: '', ffLevel: '', ffRank: '',
      weapon: '', joinDate: new Date().toISOString().split('T')[0],
    });

    await DB.addAuditLog({ userId: user.id, action: 'register', details: 'تم إنشاء الحساب', ip: req.ip });

    const token = generateToken({ id: user.id, email: user.email, role: user.role, username: user.username });
    await DB.createSession({ userId: user.id, token, device: req.headers['user-agent'] || '', ip: req.ip, lastActivity: new Date().toISOString() });

    res.status(201).json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role, status: user.status, avatar: user.avatar, verified: user.verified } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    const user = await DB.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    if (user.status === 'disabled') return res.status(403).json({ error: 'الحساب معطل' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role, username: user.username });
    await DB.createSession({ userId: user.id, token, device: req.headers['user-agent'] || '', ip: req.ip, lastActivity: new Date().toISOString() });
    await DB.updateUser(user.id, { lastLogin: new Date().toISOString() });
    await DB.addAuditLog({ userId: user.id, action: 'login', details: 'تسجيل دخول', ip: req.ip });

    res.json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role, status: user.status, avatar: user.avatar, cover: user.cover, verified: user.verified } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await DB.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
    res.json({ user: { ...user, password: undefined, verificationToken: undefined } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const allowed = ['name', 'username', 'bio', 'phone', 'country', 'age', 'instagram', 'discord', 'ffUid', 'ffIgn', 'ffServer', 'ffLevel', 'ffRank', 'weapon', 'avatar', 'cover'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.username) {
      const existing = await DB.getUserByUsername(updates.username);
      if (existing && existing.id !== req.user.id) return res.status(409).json({ error: 'اسم المستخدم مستخدم بالفعل' });
    }
    const user = await DB.updateUser(req.user.id, updates);
    await DB.addAuditLog({ userId: req.user.id, action: 'update_profile', details: 'تحديث الملف الشخصي', ip: req.ip });
    res.json({ user: { ...user, password: undefined, verificationToken: undefined } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'كلمة المرور الحالية والجديدة مطلوبتان' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
    const user = await DB.getUserById(req.user.id);
    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    const hashed = await hashPassword(newPassword);
    await DB.updateUser(req.user.id, { password: hashed });
    await DB.addAuditLog({ userId: req.user.id, action: 'change_password', details: 'تغيير كلمة المرور', ip: req.ip });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await DB.getUserSessions(req.user.id);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/auth/sessions/:id', authMiddleware, async (req, res) => {
  try {
    await DB.deleteSession(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/auth/sessions', authMiddleware, async (req, res) => {
  try {
    await DB.deleteUserSessions(req.user.id, req.query.exclude || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/auth/account', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'كلمة المرور مطلوبة لتأكيد الحذف' });
    const user = await DB.getUserById(req.user.id);
    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    await DB.deleteUserSessions(req.user.id, '');
    await DB.deleteUser(req.user.id);
    await DB.addAuditLog({ userId: req.user.id, action: 'delete_account', details: 'حذف الحساب', ip: req.ip });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/export', authMiddleware, async (req, res) => {
  try {
    const user = await DB.getUserById(req.user.id);
    const sessions = await DB.getUserSessions(req.user.id);
    const logs = await DB.getAuditLogs(req.user.id);
    res.json({ user: { ...user, password: undefined, verificationToken: undefined }, sessions, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Admin User Management ---
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    const admin = await DB.getUserById(req.user.id);
    if (!admin || (admin.role !== 'owner' && admin.role !== 'admin')) return res.status(403).json({ error: 'Forbidden' });
    const users = await DB.getAllUsers();
    res.json({ users: users.map(u => ({ ...u, password: undefined, verificationToken: undefined })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await DB.getUserById(req.user.id);
    if (!admin || (admin.role !== 'owner' && admin.role !== 'admin')) return res.status(403).json({ error: 'Forbidden' });
    const allowed = ['role', 'status', 'verified', 'avatar', 'cover', 'name', 'username', 'bio', 'country'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await DB.updateUser(req.params.id, updates);
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
    await DB.addAuditLog({ userId: req.params.id, action: 'admin_update', details: `تحديث بواسطة الإدارة: ${JSON.stringify(updates)}`, ip: req.ip });
    res.json({ user: { ...user, password: undefined, verificationToken: undefined } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users/:id/reset-password', authMiddleware, async (req, res) => {
  try {
    const admin = await DB.getUserById(req.user.id);
    if (!admin || (admin.role !== 'owner' && admin.role !== 'admin')) return res.status(403).json({ error: 'Forbidden' });
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    const hashed = await hashPassword(newPassword);
    await DB.updateUser(req.params.id, { password: hashed });
    await DB.addAuditLog({ userId: req.params.id, action: 'admin_reset_password', details: 'إعادة تعيين كلمة المرور بواسطة الإدارة', ip: req.ip });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await DB.getUserById(req.user.id);
    if (!admin || (admin.role !== 'owner' && admin.role !== 'admin')) return res.status(403).json({ error: 'Forbidden' });
    await DB.deleteUser(req.params.id);
    await DB.addAuditLog({ userId: req.params.id, action: 'admin_delete', details: 'حذف بواسطة الإدارة', ip: req.ip });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/audit-logs', authMiddleware, async (req, res) => {
  try {
    const admin = await DB.getUserById(req.user.id);
    if (!admin || (admin.role !== 'owner' && admin.role !== 'admin')) return res.status(403).json({ error: 'Forbidden' });
    const logs = await DB.getAuditLogs();
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Notifications ---
app.get('/api/notifications/mine', authMiddleware, async (req, res) => {
  try {
    const all = await DB.getNotifications();
    const mine = all.filter(n => n.userId === req.user.id || !n.userId);
    res.json({ notifications: mine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    await DB.updateNotification(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    const all = await DB.getNotifications();
    for (const n of all.filter(n => n.userId === req.user.id && !n.read)) {
      await DB.updateNotification(n.id, { read: true });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// Chat API Routes
// =====================================================

const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });

// --- Conversations ---
app.get('/api/chat/conversations', async (req, res) => {
  try { res.json(await DB.getConversations()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/chat/conversations', async (req, res) => {
  try {
    const { type, name, createdBy, members } = req.body;
    if (!type || !createdBy) return res.status(400).json({ error: 'type and createdBy required' });
    const conv = await DB.createConversation({ type, name: name || '', description: '', image: '', createdBy, lastMessage: '', lastMessageAt: new Date().toISOString(), isArchived: false, isPinned: false, isMuted: false });
    // Add creator and members
    await DB.addConversationMember({ conversationId: conv.id, userId: createdBy, role: 'owner', joinedAt: new Date().toISOString(), isMuted: false });
    if (members && Array.isArray(members)) {
      for (const uid of members) {
        if (uid !== createdBy) await DB.addConversationMember({ conversationId: conv.id, userId: uid, role: 'member', joinedAt: new Date().toISOString(), isMuted: false });
      }
    }
    res.status(201).json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/chat/conversations/:id', async (req, res) => {
  try {
    const conv = await DB.getConversation(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Not found' });
    conv.members = await DB.getConversationMembers(req.params.id);
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/chat/conversations/:id', async (req, res) => {
  try {
    const conv = await DB.updateConversation(req.params.id, req.body);
    if (!conv) return res.status(404).json({ error: 'Not found' });
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chat/conversations/:id', async (req, res) => {
  try {
    await DB.deleteConversation(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Conversation Members ---
app.post('/api/chat/conversations/:id/members', async (req, res) => {
  try {
    const { userId, role } = req.body;
    const member = await DB.addConversationMember({ conversationId: req.params.id, userId: userId || '', role: role || 'member', joinedAt: new Date().toISOString(), isMuted: false });
    res.status(201).json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chat/conversations/:id/members/:userId', async (req, res) => {
  try {
    const members = await DB.getConversationMembers(req.params.id);
    const member = members.find(m => m.userId === req.params.userId);
    if (member) await DB.removeConversationMember(member.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Messages ---
app.get('/api/chat/conversations/:id/messages', async (req, res) => {
  try {
    const msgs = await DB.getMessages(req.params.id);
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/chat/conversations/:id/messages', chatLimiter, async (req, res) => {
  try {
    const { senderId, senderName, senderAvatar, content, type, fileUrl, fileName, fileSize, mimeType, duration, replyTo } = req.body;
    const msg = await DB.createMessage({
      conversationId: req.params.id, senderId, senderName, senderAvatar,
      content: content || '', type: type || 'text', fileUrl: fileUrl || '',
      fileName: fileName || '', fileSize: fileSize || 0, mimeType: mimeType || '',
      duration: duration || 0, replyTo: replyTo || '',
      isEdited: false, isDeleted: false, deletedFor: '[]', reactions: '{}',
      status: 'sent', created_at: new Date().toISOString()
    });
    // Update conversation last message
    await DB.updateConversation(req.params.id, { lastMessage: content || (type === 'image' ? '🖼️ صورة' : type === 'audio' ? '🎵 تسجيل صوتي' : type === 'file' ? '📎 ملف' : type === 'voice' ? '🎤 رسالة صوتية' : '📎 مرفق'), lastMessageAt: new Date().toISOString(), lastMessageSender: senderName });
    res.status(201).json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/chat/messages/:id', async (req, res) => {
  try {
    const msg = await DB.updateMessage(req.params.id, { ...req.body, isEdited: true });
    if (!msg) return res.status(404).json({ error: 'Not found' });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chat/messages/:id', async (req, res) => {
  try {
    const { userId, forEveryone } = req.body;
    if (forEveryone) {
      await DB.updateMessage(req.params.id, { isDeleted: true });
    } else {
      const msg = await DB.getMessage(req.params.id);
      if (!msg) return res.status(404).json({ error: 'Not found' });
      const deletedFor = [...(msg.deletedFor || []), userId];
      await DB.updateMessage(req.params.id, { deletedFor });
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Typing ---
app.post('/api/chat/typing', async (req, res) => {
  try {
    await DB.setTypingStatus(req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/chat/typing/:conversationId', async (req, res) => {
  try {
    const users = await DB.getTypingUsers(req.params.conversationId);
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Presence ---
app.post('/api/chat/presence', async (req, res) => {
  try {
    await DB.setUserPresence(req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/chat/presence', async (req, res) => {
  try {
    const [presence, members] = await Promise.all([
      DB.getAllPresence(),
      DB.getMembers()
    ]);
    const validChatNames = new Set(members.filter(m => m.chatName).map(m => m.chatName));
    const filtered = presence.filter(p => validChatNames.has(p.username));
    res.json(filtered);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Block/Unblock ---
app.post('/api/chat/block', async (req, res) => {
  try {
    const block = await DB.blockUser(req.body);
    res.status(201).json(block);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chat/block/:userId/:blockedUserId', async (req, res) => {
  try {
    await DB.unblockUser(req.params.userId, req.params.blockedUserId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Chat Upload ---
app.post('/api/chat/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const result = await DB.uploadChatFile(req.file.buffer || require('fs').readFileSync(req.file.path), req.file.originalname, req.file.mimetype);
    res.json({ url: result.url || '/uploads/' + req.file.filename, name: req.file.originalname, size: req.file.size, type: req.file.mimetype });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Chat Join (name + password validation, or global admin password) ---
const CHAT_PASSWORD = 'aak.syria';
const DEFAULT_CONVERSATION_NAME = 'SYRIA FOUR';

app.post('/api/chat/join', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) return res.status(403).json({ error: 'الاسم مطلوب' });

    const members = await DB.getMembers();

    if (password === CHAT_PASSWORD) {
      // Global password: name must match a member's chatName
      const member = members.find(m => m.chatName === name);
      if (!member) return res.status(403).json({ error: 'الاسم غير موجود في قائمة الأعضاء' });
    } else {
      // Member credentials: chatName + chatPassword must match
      const member = members.find(m => m.chatName === name && m.chatPassword === password);
      if (!member) return res.status(403).json({ error: 'الاسم أو كلمة السر خاطئة' });
    }

    // Find or create the default "SYRIA FOUR" conversation
    const conversations = await DB.getConversations();
    let conv = conversations.find(c => c.name === DEFAULT_CONVERSATION_NAME && c.type === 'group');
    if (!conv) {
      conv = await DB.createConversation({
        type: 'group',
        name: DEFAULT_CONVERSATION_NAME,
        description: 'الدردشة العامة للكلان',
        image: '',
        createdBy: 'system',
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        isArchived: false, isPinned: false, isMuted: false
      });
    }
    res.json({ success: true, conversation: conv });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Chat Stats (admin) ---
app.get('/api/admin/chat/stats', async (req, res) => {
  try {
    const conversations = await DB.getConversations();
    const messages = await Promise.all(conversations.map(c => DB.getMessages(c.id).catch(() => [])));
    const allMsgs = messages.flat();
    const presence = await DB.getAllPresence().catch(() => []);
    res.json({
      totalConversations: conversations.length,
      totalMessages: allMsgs.length,
      totalFiles: allMsgs.filter(m => m.type === 'file' || m.type === 'image' || m.type === 'audio' || m.type === 'video').length,
      onlineUsers: presence.filter(p => p.status === 'online').length,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Admin Chat Management ---
app.get('/api/admin/chat/users', async (req, res) => {
  try { res.json(await DB.getChatUsers()); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admin/chat/users/:userId', async (req, res) => {
  try { const user = await DB.updateChatUser(req.params.userId, req.body); res.json(user); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/admin/chat/settings', async (req, res) => {
  try { res.json(await DB.getChatSettings()); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admin/chat/settings', async (req, res) => {
  try { const s = await DB.updateChatSettings(req.body); res.json(s); } catch (err) { res.status(500).json({ error: err.message }); }
});

// Dashboard SPA catch-all (must be last, after all API routes)
app.use(serveDashboard);

app.listen(PORT, () => {
  console.log(`SYRIA FOUR server running on http://localhost:${PORT}`);
});
