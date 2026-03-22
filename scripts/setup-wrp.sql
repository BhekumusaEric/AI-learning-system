-- Run this in your Supabase SQL editor
-- Creates WRP tables and fixes RLS so the API can read/write freely

-- 1. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS wrp_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wrp_progress (
  login_id TEXT PRIMARY KEY REFERENCES wrp_students(login_id) ON DELETE CASCADE,
  completed_pages JSONB DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE wrp_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrp_progress ENABLE ROW LEVEL SECURITY;

-- 3. Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "service_role_wrp_students" ON wrp_students;
DROP POLICY IF EXISTS "service_role_wrp_progress" ON wrp_progress;
DROP POLICY IF EXISTS "anon_wrp_students" ON wrp_students;
DROP POLICY IF EXISTS "anon_wrp_progress" ON wrp_progress;

-- 4. Allow ALL operations for both service_role and anon
--    (Next.js API routes use the service role key — this covers both)
CREATE POLICY "allow_all_wrp_students" ON wrp_students
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_wrp_progress" ON wrp_progress
  FOR ALL USING (true) WITH CHECK (true);
