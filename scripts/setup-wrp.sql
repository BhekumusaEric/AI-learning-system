-- WRP (Work Readiness Program) tables
-- Run this in your Supabase SQL editor

-- Students table
CREATE TABLE IF NOT EXISTS wrp_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress table
CREATE TABLE IF NOT EXISTS wrp_progress (
  login_id TEXT PRIMARY KEY REFERENCES wrp_students(login_id) ON DELETE CASCADE,
  completed_pages JSONB DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wrp_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrp_progress ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by Next.js API routes)
CREATE POLICY "service_role_wrp_students" ON wrp_students FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_wrp_progress" ON wrp_progress FOR ALL TO service_role USING (true) WITH CHECK (true);
