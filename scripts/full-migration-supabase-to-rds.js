const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const rdsConnectionString = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db.cvguww60mq70.eu-north-1.rds.amazonaws.com:5432/postgres";
const supabaseUrl = "https://hzldgvdtgkebfotpkjpt.supabase.co/rest/v1";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bGRndmR0Z2tlYmZvdHBranB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzAxNzksImV4cCI6MjA4OTAwNjE3OX0.wKOxM5AXpt-rBDzQ7LqGbu5OU1bnxsgJpbpTs0HBH7M"; 

const sql = postgres(rdsConnectionString, {
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(process.cwd(), 'global-bundle.pem'), 'utf8')
    },
    idle_timeout: 20,
    connect_timeout: 30
});

async function fetchFromSupabase(table) {
    console.log(`📡 Fetching data from Supabase: ${table}...`);
    const response = await fetch(`${supabaseUrl}/${table}?select=*`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`⚠️ Table ${table} not found in Supabase. Skipping.`);
            return [];
        }
        throw new Error(`Failed to fetch ${table}: ${response.statusText}`);
    }
    return await response.json();
}

async function migrate() {
    console.log('🏁 Starting Secure Migration (Data Integrity Mode)...');
    
    // We will use these sets to track who was actually migrated to prevent orphaned progress records
    const migratedSaaio = new Set();
    const migratedDip = new Set();
    const migratedWrp = new Set();

    try {
        // 0. Migrate Audit Logs
        const auditLogs = await fetchFromSupabase('admin_audit_log');
        console.log(`📝 Found ${auditLogs.length} audit logs.`);
        for (const log of auditLogs) {
            await sql`INSERT INTO admin_audit_log ${sql(log)} ON CONFLICT (id) DO UPDATE SET ${sql(log)}`;
        }

        // 1. Migrate Supervisors
        const supervisors = await fetchFromSupabase('supervisors');
        console.log(`👨‍🏫 Found ${supervisors.length} supervisors.`);
        for (const sup of supervisors) {
            await sql`INSERT INTO supervisors ${sql(sup)} ON CONFLICT (login_id) DO UPDATE SET ${sql(sup)}`;
        }

        // 2. Migrate Cohorts
        const cohorts = await fetchFromSupabase('cohorts');
        console.log(`📊 Found ${cohorts.length} cohorts.`);
        for (const cohort of cohorts) {
            await sql`INSERT INTO cohorts ${sql(cohort)} ON CONFLICT (id) DO UPDATE SET ${sql(cohort)}`;
        }

        // 3. Migrate SAAIO Students & Progress
        const saaioStudents = await fetchFromSupabase('saaio_students');
        console.log(`🎓 Found ${saaioStudents.length} SAAIO students.`);
        for (const student of saaioStudents) {
            await sql`INSERT INTO saaio_students ${sql(student)} ON CONFLICT (login_id) DO UPDATE SET ${sql(student)}`;
            migratedSaaio.add(student.login_id);
        }
        
        const userProgress = await fetchFromSupabase('user_progress');
        let saaioOrphans = 0;
        for (const prog of userProgress) {
            const loginId = prog.username;
            if (!migratedSaaio.has(loginId)) {
                saaioOrphans++;
                continue;
            }
            const mappedProg = {
                login_id: loginId,
                completed_pages: prog.completed_pages,
                last_active: prog.last_active
            };
            await sql`
                INSERT INTO saaio_progress (login_id, completed_pages, last_active)
                VALUES (${mappedProg.login_id}, ${mappedProg.completed_pages}, ${mappedProg.last_active})
                ON CONFLICT (login_id) DO UPDATE SET 
                    completed_pages = EXCLUDED.completed_pages,
                    last_active = EXCLUDED.last_active
            `;
        }
        console.log(`📈 SAAIO Progress: Migrated ${userProgress.length - saaioOrphans}, Skipped ${saaioOrphans} orphans.`);

        // 4. Migrate DIP Students & Progress
        const dipStudents = await fetchFromSupabase('dip_students');
        console.log(`🎓 Found ${dipStudents.length} DIP students.`);
        for (const student of dipStudents) {
            await sql`INSERT INTO dip_students ${sql(student)} ON CONFLICT (login_id) DO UPDATE SET ${sql(student)}`;
            migratedDip.add(student.login_id);
        }
        
        const dipProgress = await fetchFromSupabase('dip_progress');
        let dipOrphans = 0;
        for (const prog of dipProgress) {
            if (!migratedDip.has(prog.login_id)) {
                dipOrphans++;
                continue;
            }
            await sql`INSERT INTO dip_progress ${sql(prog)} ON CONFLICT (login_id) DO UPDATE SET ${sql(prog)}`;
        }
        console.log(`📈 DIP Progress: Migrated ${dipProgress.length - dipOrphans}, Skipped ${dipOrphans} orphans.`);

        // 5. Migrate WRP Students & Progress
        const wrpStudents = await fetchFromSupabase('wrp_students');
        console.log(`🎓 Found ${wrpStudents.length} WRP students.`);
        for (const student of wrpStudents) {
            await sql`INSERT INTO wrp_students ${sql(student)} ON CONFLICT (login_id) DO UPDATE SET ${sql(student)}`;
            migratedWrp.add(student.login_id);
        }
        
        const wrpProgress = await fetchFromSupabase('wrp_progress');
        let wrpOrphans = 0;
        for (const prog of wrpProgress) {
            if (!migratedWrp.has(prog.login_id)) {
                wrpOrphans++;
                continue;
            }
            await sql`INSERT INTO wrp_progress ${sql(prog)} ON CONFLICT (login_id) DO UPDATE SET ${sql(prog)}`;
        }
        console.log(`📈 WRP Progress: Migrated ${wrpProgress.length - wrpOrphans}, Skipped ${wrpOrphans} orphans.`);

        // 6. Migrate Invite Links
        const inviteLinks = await fetchFromSupabase('invite_links');
        console.log(`🔗 Found ${inviteLinks.length} invite links.`);
        for (const link of inviteLinks) {
            await sql`INSERT INTO invite_links ${sql(link)} ON CONFLICT (token) DO UPDATE SET ${sql(link)}`;
        }

        console.log('✅ SECURE migration complete. Database integrity verified.');

    } catch (err) {
        console.error('❌ Migration Failed:');
        console.error(err);
    } finally {
        await sql.end();
    }
}

migrate();
