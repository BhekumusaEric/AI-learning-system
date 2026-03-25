-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('supervisor', 'student')),
  platform TEXT CHECK (platform IN ('saaio', 'dip', 'wrp', 'both')),
  label TEXT,                          -- e.g. "Soweto supervisors batch 1"
  expires_at TIMESTAMPTZ,              -- NULL = never expires
  max_uses INTEGER,                    -- NULL = unlimited
  use_count INTEGER DEFAULT 0,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_invite_links" ON invite_links;
CREATE POLICY "allow_all_invite_links" ON invite_links FOR ALL USING (true) WITH CHECK (true);
