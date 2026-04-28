const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const rdsConnectionString = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db-capetown.c9u046kgwwaf.af-south-1.rds.amazonaws.com:5432/postgres";
const supabaseUrl = "https://hzldgvdtgkebfotpkjpt.supabase.co/rest/v1";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bGRndmR0Z2tlYmZvdHBranB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzAxNzksImV4cCI6MjA4OTAwNjE3OX0.wKOxM5AXpt-rBDzQ7LqGbu5OU1bnxsgJpbpTs0HBH7M"; 

const sql = postgres(rdsConnectionString, {
    ssl: {
        rejectUnauthorized: false,
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
    console.log('🏁 Starting Secure Migration (Final Mapping Mode)...');
    
    try {
        // 1. Migrate Supervisors
        const supervisors = await fetchFromSupabase('supervisors');
        console.log(`👨‍🏫 Found ${supervisors.length} supervisors.`);
        for (const sup of supervisors) {
            const mapped = {
                login_id: sup.login_id || '',
                password: sup.password_hash || '',
                name: sup.full_name || '',
                email: sup.email || '',
                created_at: sup.created_at || new Date().toISOString(),
                is_active: true
            };
            await sql`INSERT INTO supervisors ${sql(mapped)} ON CONFLICT (login_id) DO UPDATE SET ${sql(mapped)}`;
        }

        // 2. Migrate Cohorts
        const cohorts = await fetchFromSupabase('cohorts');
        console.log(`📊 Found ${cohorts.length} cohorts.`);
        for (const cohort of cohorts) {
            const mapped = {
                id: cohort.id,
                name: cohort.name || 'Unnamed Cohort',
                platform: cohort.platform || 'saaio',
                is_active: !cohort.archived,
                created_at: cohort.created_at || new Date().toISOString()
            };
            await sql`INSERT INTO cohorts ${sql(mapped)} ON CONFLICT (id) DO UPDATE SET ${sql(mapped)}`;
        }

        // 3. Migrate SAAIO Students
        const saaioStudents = await fetchFromSupabase('saaio_students');
        console.log(`🎓 Found ${saaioStudents.length} SAAIO students.`);
        for (const student of saaioStudents) {
            const mapped = {
                student_id: student.login_id,
                password: student.password_hash || '',
                name: student.full_name || '',
                email: student.email || '',
                cohort_id: student.cohort_id || null,
                created_at: student.created_at || new Date().toISOString(),
                is_active: true
            };
            await sql`INSERT INTO saaio_students ${sql(mapped)} ON CONFLICT (student_id) DO UPDATE SET ${sql(mapped)}`;
        }

        // 4. Migrate SAAIO Progress
        const userProgress = await fetchFromSupabase('user_progress');
        console.log(`📈 Found ${userProgress.length} progress records.`);
        for (const prog of userProgress) {
            const loginId = prog.username;
            const completed = prog.completed_pages || [];
            const lastUpdate = prog.last_active || new Date().toISOString();
            
            const existing = await sql`SELECT id FROM saaio_progress WHERE login_id = ${loginId} LIMIT 1`;
            if (existing.length > 0) {
                await sql`UPDATE saaio_progress SET completed_pages = ${completed}, last_updated = ${lastUpdate} WHERE id = ${existing[0].id}`;
            } else {
                const studentExists = await sql`SELECT 1 FROM saaio_students WHERE student_id = ${loginId}`;
                if (studentExists.length > 0) {
                    await sql`INSERT INTO saaio_progress (login_id, completed_pages, last_updated) VALUES (${loginId}, ${completed}, ${lastUpdate})`;
                }
            }
        }

        // 5. Migrate Invite Links
        const inviteLinks = await fetchFromSupabase('invite_links');
        console.log(`🔗 Found ${inviteLinks.length} invite links.`);
        for (const link of inviteLinks) {
            // Mapping for RDS schema: [ 'is_active', 'created_at', 'token', 'platform', 'cohort_id' ]
            const mapped = {
                token: link.token,
                platform: (link.data && link.data.platform) || 'saaio',
                cohort_id: (link.data && link.data.cohort_id) || null,
                created_at: link.created_at || new Date().toISOString(),
                is_active: !link.used_at
            };
            await sql`INSERT INTO invite_links ${sql(mapped)} ON CONFLICT (token) DO UPDATE SET ${sql(mapped)}`;
        }

        console.log('✅ ALL DATA SYNCED SUCCESSFULLY! RDS is now the source of truth.');

    } catch (err) {
        console.error('❌ Migration Failed:');
        console.error(err);
    } finally {
        await sql.end();
    }
}

migrate();
