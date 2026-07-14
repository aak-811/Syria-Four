-- SYRIA FOUR - Supabase Database Schema

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  code TEXT DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  age TEXT DEFAULT '',
  level TEXT DEFAULT '',
  gameId TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  image TEXT DEFAULT '',
  prime TEXT DEFAULT '',
  role TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  type TEXT DEFAULT '',
  description TEXT DEFAULT '',
  date TEXT DEFAULT '',
  gold TEXT DEFAULT '',
  silver TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'clock',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  glory INTEGER DEFAULT 0,
  wars INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  playerName TEXT DEFAULT '',
  playerId TEXT DEFAULT '',
  item TEXT DEFAULT '',
  payment TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support (
  id TEXT PRIMARY KEY,
  playerName TEXT DEFAULT '',
  type TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instagram (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  username TEXT DEFAULT '',
  icon TEXT DEFAULT 'crown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  label TEXT DEFAULT '',
  src TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  url TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  message TEXT DEFAULT '',
  type TEXT DEFAULT 'info',
  active BOOLEAN DEFAULT false,
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE DEFAULT '',
  uid TEXT DEFAULT '',
  level INTEGER DEFAULT 0,
  rank TEXT DEFAULT '',
  rankPoints INTEGER DEFAULT 0,
  country TEXT DEFAULT '',
  language TEXT DEFAULT '',
  clan TEXT DEFAULT '',
  season TEXT DEFAULT '',
  joinDate TEXT DEFAULT '',
  yearsPlayed TEXT DEFAULT '',
  badges TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  bio TEXT DEFAULT '',
  profileImage TEXT DEFAULT '',
  weapons JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  pet JSONB DEFAULT '{}',
  character JSONB DEFAULT '{}',
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
