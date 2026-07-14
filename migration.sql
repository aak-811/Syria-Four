-- SYRIA FOUR - Schema Migration (add missing tables & columns)
-- Run this in Supabase Studio > SQL Editor

-- ===== 1. ADD MISSING COLUMNS TO EXISTING TABLES =====

-- members: add images column
ALTER TABLE members ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- tournaments: add new columns
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "startDate" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "endDate" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "maxPlayers" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "mapType" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS persistent TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "mapDesign" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS winners TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "prizeType" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "prizeValue" TEXT DEFAULT '';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS participants JSONB DEFAULT '[]';


-- ===== 2. CREATE NEW TABLES =====

-- users
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
  "updatedAt" TEXT DEFAULT ''
);

-- sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL DEFAULT '',
  token TEXT DEFAULT '',
  device TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  "lastActivity" TEXT DEFAULT '',
  "createdAt" TEXT DEFAULT ''
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  "userId" TEXT DEFAULT '',
  action TEXT DEFAULT '',
  details TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  "createdAt" TEXT DEFAULT ''
);

-- requests
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  "tournamentId" TEXT DEFAULT '',
  "playerName" TEXT DEFAULT '',
  "playerGameId" TEXT DEFAULT '',
  reason TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 3. RELOAD PostgREST SCHEMA =====
NOTIFY pgrst, 'reload schema';
