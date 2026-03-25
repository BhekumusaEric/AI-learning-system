-- ============================================================
-- Supervisor & Cohort System
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Supervisors table
CREATE TABLE IF NOT EXISTS supervisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('dip', 'wrp', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Extend cohorts table
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES supervisors(id) ON DELETE SET NULL;
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS start_date DATE;

-- 3. Generate invite codes for any existing cohorts that don't have one
UPDATE cohorts SET invite_code = UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8)) WHERE invite_code IS NULL;

-- 4. Enable RLS on supervisors
ALTER TABLE supervisors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_supervisors" ON supervisors;
CREATE POLICY "allow_all_supervisors" ON supervisors FOR ALL USING (true) WITH CHECK (true);

-- 5. Ensure cohorts RLS allows all (service role)
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON cohorts;
DROP POLICY IF EXISTS "allow_all_cohorts" ON cohorts;
CREATE POLICY "allow_all_cohorts" ON cohorts FOR ALL USING (true) WITH CHECK (true);
