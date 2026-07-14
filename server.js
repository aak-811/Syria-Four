require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const DB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
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

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`SYRIA FOUR server running on http://localhost:${PORT}`);
});
