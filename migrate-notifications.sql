-- Migration: Add new columns to notifications table
-- Run this in Supabase SQL Editor or via: node -e "require('pg').Pool({connectionString:process.env.DATABASE_URL}).query(require('fs').readFileSync('migrate-notifications.sql','utf8')).then(()=>console.log('Done')).catch(e=>console.error(e))"

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'everyone';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Bell';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#00E5FF';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target TEXT DEFAULT '';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT DEFAULT '';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "createdBy" TEXT DEFAULT '';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "readBy" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
