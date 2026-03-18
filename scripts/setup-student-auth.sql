-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS saaio_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dip_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DIP progress table (SAAIO uses existing user_progress)
CREATE TABLE IF NOT EXISTS dip_progress (
  login_id TEXT PRIMARY KEY,
  completed_pages JSONB DEFAULT '{}',
  exam_score INTEGER,
  exam_passed BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Rename existing user_progress username column to login_id for consistency (optional, skip if it breaks things)
-- ALTER TABLE user_progress RENAME COLUMN username TO login_id;
