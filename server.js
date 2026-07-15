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

// Admin login redirect
app.post('/api/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === 'syria2026' || password === 'aak1qusai7' || password === 'Za3im1syria') {
    return res.json({ redirect: '/admin/' });
  }
  return res.status(401).json({ error: 'كلمة المرور خاطئة' });
});

// Serve admin dashboard (Next.js static export) at /admin/
const dashboardPath = path.join(__dirname, 'admin-dashboard', 'out');

// Serve dashboard static assets (JS, CSS, images) - MUST be before /admin handler
app.use('/admin/_next', express.static(path.join(dashboardPath, '_next')));

// Serve exact dashboard page HTML files and other static files
app.use('/admin', (req, res, next) => {
  if (req.method !== 'GET') return next();
  
  let filePath = req.path;
  
  // Remove trailing slash (if any)
  if (filePath.endsWith('/') && filePath !== '/') filePath = filePath.slice(0, -1);
  
  // Try to serve the actual page HTML: /admin/members -> out/members/index.html
  if (filePath && filePath !== '/') {
    const pagePath = path.join(dashboardPath, filePath.slice(1), 'index.html');
    if (fs.existsSync(pagePath)) {
      return res.sendFile(pagePath);
    }
  }
  
  // Fallback to root index.html (SPA client-side routing)
  res.sendFile(path.join(dashboardPath, 'index.html'));
});

// Serve main clan site at root /
app.use(express.static(path.join(__dirname, 'clan-site'), { extensions: ['html'] }));

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
    // Check username uniqueness
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

// Catch-all: serve clan site index for SPA-like behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'clan-site', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SYRIA FOUR server running on http://localhost:${PORT}`);
});
