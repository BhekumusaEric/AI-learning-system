const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// RDS Connection String (Using SSL for security)
const connectionString = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db.cvguww60mq70.eu-north-1.rds.amazonaws.com:5432/postgres";

async function syncSchema() {
    console.log('🚀 Starting RDS Schema Synchronization...');
    
    const sql = postgres(connectionString, {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync(path.join(process.cwd(), 'global-bundle.pem'), 'utf8')
        }
    });

    try {
        // 0. Create Supervisors Table (dependency for cohorts)
        console.log('Creating supervisors table...');
        await sql`
            CREATE TABLE IF NOT EXISTS supervisors (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                login_id TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT,
                platform TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        // 0.1 Create Admin Audit Log Table
        console.log('Creating admin_audit_log table...');
        await sql`
            CREATE TABLE IF NOT EXISTS admin_audit_log (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                admin_id TEXT,
                action TEXT NOT NULL,
                target_type TEXT,
                target_id TEXT,
                details JSONB,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        // 1. Create/Update Cohorts Table
        console.log('Updating cohorts table schema...');
        await sql`
            CREATE TABLE IF NOT EXISTS cohorts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                platform TEXT,
                archived BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        
        // Add missing columns to cohorts if they don't exist
        console.log('Adding missing columns to cohorts...');
        await sql`ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS supervisor_id UUID`;
        await sql`ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS invite_code TEXT`;
        await sql`ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS description TEXT`;
        await sql`ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS location TEXT`;
        await sql`ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS start_date DATE`;

        // 1. Create/Update SAAIO Tables
        console.log('Ensuring saaio_students table is correct...');
        await sql`ALTER TABLE saaio_students DROP CONSTRAINT IF EXISTS saaio_students_email_key`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid()`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS email_otp TEXT`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMPTZ`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS certificate_requested BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS certificate_unlocked BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS certificate_name TEXT`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS name_change_requested BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS verify_token TEXT`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS session_token TEXT`;
        await sql`ALTER TABLE saaio_students ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMPTZ`;
        
        // 2. Create DIP (Digital Inclusion Program) Tables
        console.log('Creating DIP tables...');
        await sql`
            CREATE TABLE IF NOT EXISTS dip_students (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                login_id TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                cohort_id UUID
            );
        `;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid()`;
        await sql`ALTER TABLE dip_students DROP CONSTRAINT IF EXISTS dip_students_email_key`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS email_otp TEXT`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMPTZ`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS certificate_requested BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS certificate_unlocked BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS certificate_name TEXT`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS name_change_requested BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS verify_token TEXT`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS session_token TEXT`;
        await sql`ALTER TABLE dip_students ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMPTZ`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS dip_progress (
                login_id TEXT PRIMARY KEY,
                completed_pages JSONB DEFAULT '{}',
                exam_score INTEGER,
                exam_passed BOOLEAN DEFAULT FALSE,
                last_active TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        // 3. Create WRP (Work Readiness Program) Tables
        console.log('Creating WRP tables...');
        await sql`
            CREATE TABLE IF NOT EXISTS wrp_students (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                login_id TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                cohort_id UUID
            );
        `;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid()`;
        await sql`ALTER TABLE wrp_students DROP CONSTRAINT IF EXISTS wrp_students_email_key`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS email_otp TEXT`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMPTZ`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS certificate_requested BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS certificate_unlocked BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS certificate_name TEXT`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS name_change_requested BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS verify_token TEXT`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS session_token TEXT`;
        await sql`ALTER TABLE wrp_students ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMPTZ`;

        await sql`
            CREATE TABLE IF NOT EXISTS wrp_progress (
                login_id TEXT PRIMARY KEY,
                completed_pages JSONB DEFAULT '{}',
                last_active TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        await sql`ALTER TABLE wrp_progress ADD COLUMN IF NOT EXISTS quiz_scores JSONB DEFAULT '{}'`;

        // 3. Create Invite Links Table
        console.log('Creating invite_links table...');
        await sql`
            CREATE TABLE IF NOT EXISTS invite_links (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                token TEXT UNIQUE NOT NULL,
                type TEXT NOT NULL,
                platform TEXT,
                label TEXT, 
                expires_at TIMESTAMPTZ,
                max_uses INTEGER,
                use_count INTEGER DEFAULT 0,
                revoked BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        
        console.log('✅ RDS Schema is now synchronized for all platforms (SAAIO, DIP, WRP).');
    } catch (err) {
        console.error('❌ Schema Sync Failed:');
        console.error(err);
    } finally {
        await sql.end();
    }
}

syncSchema();
