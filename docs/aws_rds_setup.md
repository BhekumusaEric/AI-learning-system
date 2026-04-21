# Amazon RDS (PostgreSQL) Migration Guide

This guide provides technical instructions for the DevOps team (Wonderby) to provision and initialize the native AWS database for the WeThinkCode_ Training Grounds.

## 1. Provisioning Requirements
- **Engine**: PostgreSQL 16.x or higher
- **Instance**: t3.micro or t3.small (Standard)
- **Security**: Ensure port 5432 is ONLY accessible from the EC2 instance Security Group.
- **VPC**: Deploy within the same VPC as the EC2 application server.

## 2. Database Schema (DDL)
Run the following SQL in your RDS instance to initialize the Training Grounds structure.

```sql
-- Cohorts Management
CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'saaio', 'dip', 'wrp'
    description TEXT,
    location TEXT,
    start_date TEXT,
    invite_code TEXT UNIQUE,
    archived BOOLEAN DEFAULT FALSE,
    supervisor_id UUID REFERENCES supervisors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles (Universal)
CREATE TABLE saaio_students (
    login_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    cohort_id UUID REFERENCES cohorts(id),
    email_otp TEXT,
    email_otp_expires_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dip_students (
    login_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    cohort_id UUID REFERENCES cohorts(id),
    email_otp TEXT,
    email_otp_expires_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wrp_students (
    login_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    cohort_id UUID REFERENCES cohorts(id),
    email_otp TEXT,
    email_otp_expires_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Progress Tracking (Normalized)
CREATE TABLE saaio_progress (
    login_id TEXT PRIMARY KEY REFERENCES saaio_students(login_id) ON DELETE CASCADE,
    completed_pages JSONB DEFAULT '{}'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exam_score INTEGER,
    exam_passed BOOLEAN
);

CREATE TABLE dip_progress (
    login_id TEXT PRIMARY KEY REFERENCES dip_students(login_id) ON DELETE CASCADE,
    completed_pages JSONB DEFAULT '{}'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exam_score INTEGER,
    exam_passed BOOLEAN
);

CREATE TABLE wrp_progress (
    login_id TEXT PRIMARY KEY REFERENCES wrp_students(login_id) ON DELETE CASCADE,
    completed_pages JSONB DEFAULT '{}'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exam_score INTEGER,
    exam_passed BOOLEAN
);

-- Administrative Streams
CREATE TABLE supervisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    platform TEXT, -- 'saaio', 'dip', 'wrp'
    role TEXT DEFAULT 'supervisor', -- 'admin', 'supervisor'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invite_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'student', 'supervisor'
    platform TEXT, -- 'saaio', 'dip', 'wrp'
    label TEXT,
    use_count INTEGER DEFAULT 0,
    max_uses INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Environment Integration
Once provisioned, update the `.env` file with the connection string:
```
DATABASE_URL="postgres://username:password@rds-endpoint.aws.com:5432/postgres"
```
