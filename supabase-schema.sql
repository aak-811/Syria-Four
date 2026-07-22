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

CREATE TABLE IF NOT EXISTS awards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  "holderName" TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vip (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  "instagram1" TEXT DEFAULT '',
  "instagram2" TEXT DEFAULT '',
  "link1" TEXT DEFAULT '',
  "link2" TEXT DEFAULT '',
  "isEnabled" BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "hall-of-fame" (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  "playerName" TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
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
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "playStyle" TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "isPrime" BOOLEAN DEFAULT false;
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "goldFrame" BOOLEAN DEFAULT false;
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "vipBadge" BOOLEAN DEFAULT false;
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "nameColor" TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "profileColor" TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "galleryImage" TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatName" TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatPassword" TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatOwnBubbleBg" TEXT DEFAULT '#005C4B';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatOwnBubbleText" TEXT DEFAULT '#FFFFFF';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatOtherBubbleBg" TEXT DEFAULT '#1A1A2E';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatOtherBubbleText" TEXT DEFAULT '#FFFFFF';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatBg" TEXT DEFAULT '#0A0A1A';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatHeaderBg" TEXT DEFAULT '#0D0D20';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatInputBg" TEXT DEFAULT '#1A1A2E';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "chatAccentColor" TEXT DEFAULT '#00E5FF';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '';
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '';
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "teamsCount" INTEGER DEFAULT 0;
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "snowType" TEXT DEFAULT '';
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS "maxPlayers" INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE events ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
  ALTER TABLE events ADD COLUMN IF NOT EXISTS reward TEXT DEFAULT '';
  ALTER TABLE events ADD COLUMN IF NOT EXISTS participants INTEGER DEFAULT 0;
  ALTER TABLE events ADD COLUMN IF NOT EXISTS squad TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Additional columns for new app features
DO $$ BEGIN
  ALTER TABLE members ADD COLUMN IF NOT EXISTS prime TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
  ALTER TABLE members ADD COLUMN IF NOT EXISTS "isPrime" BOOLEAN DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '';
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS pack TEXT DEFAULT '';
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS name TEXT DEFAULT '';
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS "gameId" TEXT DEFAULT '';
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE support ADD COLUMN IF NOT EXISTS name TEXT DEFAULT '';
  ALTER TABLE support ADD COLUMN IF NOT EXISTS "gameId" TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '';
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS "tournamentName" TEXT DEFAULT '';
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS "eventName" TEXT DEFAULT '';
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS name TEXT DEFAULT '';
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS "gameId" TEXT DEFAULT '';
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE events ADD COLUMN IF NOT EXISTS prize TEXT DEFAULT '';
  ALTER TABLE events ADD COLUMN IF NOT EXISTS "maxPlayers" TEXT DEFAULT '';
  ALTER TABLE events ADD COLUMN IF NOT EXISTS "startDate" TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE support ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hall-of-fame" ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT on all tables (for anon key access)
DO $$ BEGIN
  CREATE POLICY "allow_public_select" ON members FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON tournaments FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON events FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON leaderboard FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON orders FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON support FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON instagram FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON gallery FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON videos FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON notifications FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON players FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON requests FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON users FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON sessions FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON audit_logs FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON awards FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON vip FOR SELECT USING (true);
  CREATE POLICY "allow_public_select" ON "hall-of-fame" FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- Chat System Tables
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'private' CHECK (type IN ('private', 'group')),
  name TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  "createdBy" TEXT DEFAULT '',
  "lastMessage" TEXT DEFAULT '',
  "lastMessageAt" TIMESTAMPTZ,
  "lastMessageSender" TEXT DEFAULT '',
  "isArchived" BOOLEAN DEFAULT false,
  "isPinned" BOOLEAN DEFAULT false,
  "isMuted" BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_members (
  id TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  "joinedAt" TIMESTAMPTZ DEFAULT NOW(),
  "lastReadAt" TIMESTAMPTZ DEFAULT NOW(),
  "isMuted" BOOLEAN DEFAULT false,
  UNIQUE("conversationId", "userId")
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "senderId" TEXT NOT NULL,
  "senderName" TEXT DEFAULT '',
  "senderAvatar" TEXT DEFAULT '',
  content TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text','image','video','audio','file','gif','sticker','voice','system')),
  "fileUrl" TEXT DEFAULT '',
  "fileName" TEXT DEFAULT '',
  "fileSize" INTEGER DEFAULT 0,
  "mimeType" TEXT DEFAULT '',
  duration REAL DEFAULT 0,
  "replyTo" TEXT DEFAULT '',
  "isEdited" BOOLEAN DEFAULT false,
  "isDeleted" BOOLEAN DEFAULT false,
  "deletedFor" JSONB DEFAULT '[]',
  "reactions" JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'sending' CHECK (status IN ('sending','sent','delivered','seen')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_reads (
  id TEXT PRIMARY KEY,
  "messageId" TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "readAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("messageId", "userId")
);

CREATE TABLE IF NOT EXISTS typing_status (
  id TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  username TEXT DEFAULT '',
  "isTyping" BOOLEAN DEFAULT false,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("conversationId", "userId")
);

CREATE TABLE IF NOT EXISTS user_presence (
  "userId" TEXT PRIMARY KEY,
  username TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online','offline','away','busy')),
  "lastSeen" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_users (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "blockedUserId" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("userId", "blockedUserId")
);

CREATE TABLE IF NOT EXISTS pinned_messages (
  id TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "messageId" TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  "pinnedBy" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("conversationId", "messageId")
);

CREATE TABLE IF NOT EXISTS deleted_messages (
  id TEXT PRIMARY KEY,
  "messageId" TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "deletedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("messageId", "userId")
);

-- Indexes for chat
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages("conversationId", created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderId");
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON conversation_members("userId");
CREATE INDEX IF NOT EXISTS idx_conversation_members_conversation ON conversation_members("conversationId");
CREATE INDEX IF NOT EXISTS idx_typing_status_conversation ON typing_status("conversationId");
CREATE INDEX IF NOT EXISTS idx_message_reads_user ON message_reads("userId");
CREATE INDEX IF NOT EXISTS idx_blocked_users_user ON blocked_users("userId");
CREATE INDEX IF NOT EXISTS idx_pinned_messages_conversation ON pinned_messages("conversationId");

CREATE TABLE IF NOT EXISTS chat_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "ownBubbleBg" TEXT DEFAULT '#005C4B',
  "ownBubbleText" TEXT DEFAULT '#FFFFFF',
  "otherBubbleBg" TEXT DEFAULT '#1A1A2E',
  "otherBubbleText" TEXT DEFAULT '#FFFFFF',
  "chatBg" TEXT DEFAULT '#0A0A1A',
  "headerBg" TEXT DEFAULT '#0D0D20',
  "inputBg" TEXT DEFAULT '#1A1A2E',
  "accentColor" TEXT DEFAULT '#00E5FF',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinned_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for chat since we use simple identity)
DO $$ BEGIN
  CREATE POLICY "allow_all_conversations" ON conversations FOR ALL USING (true);
  CREATE POLICY "allow_all_conversation_members" ON conversation_members FOR ALL USING (true);
  CREATE POLICY "allow_all_messages" ON messages FOR ALL USING (true);
  CREATE POLICY "allow_all_message_reads" ON message_reads FOR ALL USING (true);
  CREATE POLICY "allow_all_typing_status" ON typing_status FOR ALL USING (true);
  CREATE POLICY "allow_all_user_presence" ON user_presence FOR ALL USING (true);
  CREATE POLICY "allow_all_blocked_users" ON blocked_users FOR ALL USING (true);
  CREATE POLICY "allow_all_pinned_messages" ON pinned_messages FOR ALL USING (true);
  CREATE POLICY "allow_all_deleted_messages" ON deleted_messages FOR ALL USING (true);
  CREATE POLICY "allow_all_chat_settings" ON chat_settings FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
