-- Run this in Supabase SQL Editor
-- Adds email verification columns to all student tables

ALTER TABLE saaio_students
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_otp TEXT,
  ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMPTZ;

ALTER TABLE dip_students
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_otp TEXT,
  ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMPTZ;

ALTER TABLE wrp_students
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_otp TEXT,
  ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMPTZ;

-- Mark existing students who already have an email as verified
-- (they were added by admin so we trust those emails)
UPDATE saaio_students SET email_verified = TRUE WHERE email IS NOT NULL AND email != '';
UPDATE dip_students SET email_verified = TRUE WHERE email IS NOT NULL AND email != '';
UPDATE wrp_students SET email_verified = TRUE WHERE email IS NOT NULL AND email != '';
