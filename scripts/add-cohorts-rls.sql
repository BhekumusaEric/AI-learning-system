-- Run in Supabase SQL Editor

ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service role (used by your API)
CREATE POLICY "Service role full access" ON cohorts
  FOR ALL
  USING (true)
  WITH CHECK (true);
