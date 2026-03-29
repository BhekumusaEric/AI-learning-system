-- Run in Supabase SQL Editor

ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS certificate_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS certificate_unlocked BOOLEAN DEFAULT FALSE;

ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS certificate_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS certificate_unlocked BOOLEAN DEFAULT FALSE;
