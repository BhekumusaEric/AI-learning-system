-- Run in Supabase SQL Editor

ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS certificate_name TEXT;
ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS name_change_requested BOOLEAN DEFAULT FALSE;

ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS certificate_name TEXT;
ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS name_change_requested BOOLEAN DEFAULT FALSE;
