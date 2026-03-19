-- Option 1: Disable RLS entirely on these tables (simplest for admin-only tables)
ALTER TABLE saaio_students DISABLE ROW LEVEL SECURITY;
ALTER TABLE dip_students DISABLE ROW LEVEL SECURITY;
ALTER TABLE dip_progress DISABLE ROW LEVEL SECURITY;

-- Also fix user_progress if it has RLS issues
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
