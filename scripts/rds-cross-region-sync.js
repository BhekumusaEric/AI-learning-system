const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const sourceUrl = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db.cvguww60mq70.eu-north-1.rds.amazonaws.com:5432/postgres";
const targetUrl = process.env.TARGET_DATABASE_URL; // Target (Cape Town) URL passed via env

if (!targetUrl) {
    console.error('❌ ERROR: TARGET_DATABASE_URL environment variable is missing.');
    console.log('Usage: TARGET_DATABASE_URL=postgres://... node scripts/rds-cross-region-sync.js');
    process.exit(1);
}

const sslConfig = {
    ssl: {
        rejectUnauthorized: false
    }
};

const sqlSource = postgres(sourceUrl, { ...sslConfig, idle_timeout: 20 });
const sqlTarget = postgres(targetUrl, { ...sslConfig, idle_timeout: 20 });

async function syncTable(tableName, conflictCol = 'id') {
    console.log(`📡 Syncing Table: ${tableName}...`);
    const data = await sqlSource`SELECT * FROM ${sqlSource(tableName)}`;
    console.log(`📊 Found ${data.length} records in ${tableName}.`);
    
    if (data.length === 0) return;

    // Use Upsert logic for safety
    for (const row of data) {
        await sqlTarget`
            INSERT INTO ${sqlTarget(tableName)} ${sqlTarget(row)}
            ON CONFLICT (${sqlTarget(conflictCol)}) DO UPDATE SET ${sqlTarget(row)}
        `;
    }
    console.log(`✅ ${tableName} sync complete.`);
}

async function startMigration() {
    console.log('🏁 Starting Cross-Region Sync (Stockholm -> Cape Town)...');
    try {
        // Ensure search path is correct
        await sqlTarget`SET search_path TO public`;
        
        // Order matters for Foreign Keys
        await syncTable('supervisors', 'login_id');
        await syncTable('admin_audit_log', 'id');
        await syncTable('cohorts', 'id');
        await syncTable('saaio_students', 'student_id');
        await syncTable('saaio_progress', 'login_id');
        await syncTable('dip_students', 'login_id');
        await syncTable('dip_progress', 'login_id');
        await syncTable('wrp_students', 'login_id');
        await syncTable('wrp_progress', 'login_id');
        await syncTable('invite_links', 'token');

        console.log('🎉 Full data migration to Cape Town is complete!');
    } catch (err) {
        console.error('❌ Migration Failed:');
        console.error(err);
    } finally {
        await sqlSource.end();
        await sqlTarget.end();
    }
}

startMigration();
