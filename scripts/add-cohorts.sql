-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('saaio', 'dip', 'wrp')),
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL;
ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL;
ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL;