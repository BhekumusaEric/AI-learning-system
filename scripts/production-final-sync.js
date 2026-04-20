const postgres = require('postgres');

// --- CONFIGURATION ---
const sourceUrl = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db.cvguww60mq70.eu-north-1.rds.amazonaws.com:5432/postgres";
const targetUrl = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db-capetown.c9u046kgwwaf.af-south-1.rds.amazonaws.com:5432/postgres"; 

const sqlSource = postgres(sourceUrl, { ssl: { rejectUnauthorized: false }, idle_timeout: 20 });
const sqlTarget = postgres(targetUrl, { ssl: { rejectUnauthorized: false }, idle_timeout: 20 });

async function initSchema() {
    console.log('🏗️ Initializing Clean Schema in Cape Town...');
    await sqlTarget`SET search_path TO public`;

    const tablesToDrop = ['saaio_students', 'saaio_progress', 'dip_students', 'dip_progress', 'wrp_students', 'wrp_progress', 'supervisors', 'cohorts', 'admin_audit_log', 'invite_links'];
    for (const table of tablesToDrop) {
        await sqlTarget`DROP TABLE IF EXISTS ${sqlTarget(table)} CASCADE`;
    }

    // Supervisors
    await sqlTarget`CREATE TABLE supervisors (
        login_id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        password TEXT,
        cohorts TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_login TIMESTAMPTZ
    )`;

    // SAAIO Students
    await sqlTarget`CREATE TABLE saaio_students (
        student_id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        password TEXT,
        cohort_id TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_login TIMESTAMPTZ,
        onboarding_status TEXT DEFAULT 'pending'
    )`;

    // SAAIO Progress
    await sqlTarget`CREATE TABLE saaio_progress (
        id SERIAL PRIMARY KEY,
        login_id TEXT REFERENCES saaio_students(student_id),
        ground_id TEXT,
        completed_items JSONB DEFAULT '{}',
        quiz_scores JSONB DEFAULT '{}',
        last_updated TIMESTAMPTZ DEFAULT NOW()
    )`;
    await sqlTarget`CREATE UNIQUE INDEX IF NOT EXISTS saaio_progress_login_ground_idx ON saaio_progress(login_id, ground_id)`;

    // DIP Students
    await sqlTarget`CREATE TABLE dip_students (
        login_id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        password TEXT,
        cohort_id TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    // WRP Students
    await sqlTarget`CREATE TABLE wrp_students (
        login_id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        password TEXT,
        cohort_id TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    // Admin Audit Log
    await sqlTarget`CREATE TABLE admin_audit_log (
        id SERIAL PRIMARY KEY,
        admin_id TEXT,
        action TEXT,
        details JSONB,
        timestamp TIMESTAMPTZ DEFAULT NOW()
    )`;

    // Cohorts
    await sqlTarget`CREATE TABLE cohorts (
        id TEXT PRIMARY KEY,
        name TEXT,
        platform TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    // Invite Links
    await sqlTarget`CREATE TABLE invite_links (
        token TEXT PRIMARY KEY,
        platform TEXT,
        cohort_id TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    console.log('✅ Clean Schema provisioned.');
}

async function syncTable(tableName, conflictCol = 'id') {
    console.log(`📡 Syncing Table: ${tableName}...`);
    
    // 1. Get Target Schema Columns
    const targetCols = await sqlTarget`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
    `.then(res => res.map(c => c.column_name));
    
    console.log(`📋 Target table ${tableName} has ${targetCols.length} columns.`);

    // 2. Get Source Data
    const data = await sqlSource`SELECT * FROM ${sqlSource(tableName)}`;
    console.log(`📊 Found ${data.length} records in ${tableName}.`);
    
    if (data.length === 0) return;

    // 3. Filter and Insert row-by-row for safety
    let count = 0;
    for (const row of data) {
        // Create clean object with ONLY the columns that exist in the target
        const filteredRow = {};
        targetCols.forEach(col => {
            if (row.hasOwnProperty(col)) {
                filteredRow[col] = row[col];
            }
        });

        // Mapping Logic: If target expects student_id but we only have login_id
        if (targetCols.includes('student_id') && !filteredRow.student_id && row.login_id) {
            filteredRow.student_id = row.login_id;
        }

        await sqlTarget`
            INSERT INTO ${sqlTarget(tableName)} ${sqlTarget(filteredRow)}
            ON CONFLICT (${sqlTarget(conflictCol)}) DO UPDATE SET ${sqlTarget(filteredRow)}
        `;
        count++;
        if (count % 500 === 0) console.log(`⏩ Progress: ${count}/${data.length}...`);
    }
    console.log(`✅ ${tableName} sync complete.`);
}

async function masterSync() {
    console.log('🏁 Starting Master Production Alignment (Clean Slate)...');
    try {
        await initSchema();
        
        await syncTable('supervisors', 'login_id');
        await syncTable('admin_audit_log', 'id');
        await syncTable('cohorts', 'id');
        await syncTable('saaio_students', 'student_id');
        await syncTable('saaio_progress', 'id');
        await syncTable('dip_students', 'login_id');
        await syncTable('wrp_students', 'login_id');
        await syncTable('invite_links', 'token');

        console.log('🎉 MASTER ALIGNMENT COMPLETE! Cape Town is now 100% synchronized with Stockholm.');
    } catch (err) {
        console.error('❌ Master Alignment Failed:');
        console.error(err);
    } finally {
        await sqlSource.end();
        await sqlTarget.end();
    }
}

masterSync();
