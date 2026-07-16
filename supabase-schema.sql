-- SYRIA FOUR - Supabase Database Schema (non-destructive)
-- Creates tables if they don't exist, adds missing columns

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  code TEXT DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  age TEXT DEFAULT '',
  level TEXT DEFAULT '',
  "gameId" TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  image TEXT DEFAULT '',
  prime TEXT DEFAULT '',
  role TEXT DEFAULT '',
  country TEXT DEFAULT '',
  "joinDate" TEXT DEFAULT '',
  weapon TEXT DEFAULT '',
  wins INTEGER DEFAULT 0,
  tournaments INTEGER DEFAULT 0,
  bio TEXT DEFAULT '',
  "rank" TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  type TEXT DEFAULT '',
  description TEXT DEFAULT '',
  date TEXT DEFAULT '',
  "startDate" TEXT DEFAULT '',
  "endDate" TEXT DEFAULT '',
  "maxPlayers" TEXT DEFAULT '',
  mode TEXT DEFAULT '',
  "mapType" TEXT DEFAULT '',
  persistent TEXT DEFAULT '',
  "mapDesign" TEXT DEFAULT '',
  winners TEXT DEFAULT '',
  "prizeType" TEXT DEFAULT '',
  "prizeValue" TEXT DEFAULT '',
  gold TEXT DEFAULT '',
  silver TEXT DEFAULT '',
  logo TEXT DEFAULT '',
  status TEXT DEFAULT '',
  "teamsCount" INTEGER DEFAULT 0,
  participants JSONB DEFAULT '[]',
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
  "playerName" TEXT DEFAULT '',
  "playerId" TEXT DEFAULT '',
  item TEXT DEFAULT '',
  payment TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support (
  id TEXT PRIMARY KEY,
  "playerName" TEXT DEFAULT '',
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
  title TEXT DEFAULT '',
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
  "rank" TEXT DEFAULT '',
  "rankPoints" INTEGER DEFAULT 0,
  country TEXT DEFAULT '',
  language TEXT DEFAULT '',
  clan TEXT DEFAULT '',
  season TEXT DEFAULT '',
  "joinDate" TEXT DEFAULT '',
  "yearsPlayed" TEXT DEFAULT '',
  badges TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  bio TEXT DEFAULT '',
  "profileImage" TEXT DEFAULT '',
  weapons JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  pet JSONB DEFAULT '{}',
  character JSONB DEFAULT '{}',
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  "tournamentId" TEXT DEFAULT '',
  "playerName" TEXT DEFAULT '',
  "playerGameId" TEXT DEFAULT '',
  reason TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  username TEXT UNIQUE NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  verified BOOLEAN DEFAULT false,
  "verificationToken" TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  country TEXT DEFAULT '',
  age TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  discord TEXT DEFAULT '',
  "ffUid" TEXT DEFAULT '',
  "ffIgn" TEXT DEFAULT '',
  "ffServer" TEXT DEFAULT '',
  "ffLevel" TEXT DEFAULT '',
  "ffRank" TEXT DEFAULT '',
  weapon TEXT DEFAULT '',
  "joinDate" TEXT DEFAULT '',
  "lastLogin" TEXT DEFAULT '',
  "createdAt" TEXT DEFAULT '',
  "updatedAt" TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL DEFAULT '',
  token TEXT DEFAULT '',
  device TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  "lastActivity" TEXT DEFAULT '',
  "createdAt" TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  "userId" TEXT DEFAULT '',
  action TEXT DEFAULT '',
  details TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  "createdAt" TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns for existing tables (safe, IF NOT EXISTS)
DO $$ BEGIN
  ALTER TABLE members ADD COLUMN IF NOT EXISTS tournaments INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '';
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '';
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "teamsCount" INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
