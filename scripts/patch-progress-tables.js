const postgres = require('postgres');

// --- CONFIGURATION ---
const sourceUrl = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db.cvguww60mq70.eu-north-1.rds.amazonaws.com:5432/postgres";
const targetUrl = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db-capetown.c9u046kgwwaf.af-south-1.rds.amazonaws.com:5432/postgres"; 

const sqlSource = postgres(sourceUrl, { ssl: { rejectUnauthorized: false }, idle_timeout: 20 });
const sqlTarget = postgres(targetUrl, { ssl: { rejectUnauthorized: false }, idle_timeout: 20 });

async function patchSchema() {
    console.log('🏗️ Patching Schema to include DIP and WRP progress tables...');
    await sqlTarget`SET search_path TO public`;

    // Drop them if they accidentally exist in a broken state
    await sqlTarget`DROP TABLE IF EXISTS dip_progress CASCADE`;
    await sqlTarget`DROP TABLE IF EXISTS wrp_progress CASCADE`;

    // DIP Progress
    await sqlTarget`CREATE TABLE dip_progress (
        id SERIAL PRIMARY KEY,
        login_id TEXT REFERENCES dip_students(login_id),
        ground_id TEXT,
        completed_items JSONB DEFAULT '{}',
        quiz_scores JSONB DEFAULT '{}',
        last_updated TIMESTAMPTZ DEFAULT NOW()
    )`;
    await sqlTarget`CREATE UNIQUE INDEX IF NOT EXISTS dip_progress_login_ground_idx ON dip_progress(login_id, ground_id)`;

    // WRP Progress
    await sqlTarget`CREATE TABLE wrp_progress (
        id SERIAL PRIMARY KEY,
        login_id TEXT REFERENCES wrp_students(login_id),
        ground_id TEXT,
        completed_items JSONB DEFAULT '{}',
        quiz_scores JSONB DEFAULT '{}',
        last_updated TIMESTAMPTZ DEFAULT NOW()
    )`;
    await sqlTarget`CREATE UNIQUE INDEX IF NOT EXISTS wrp_progress_login_ground_idx ON wrp_progress(login_id, ground_id)`;

    console.log('✅ Progress Schema patched.');
}

async function syncTable(tableName, conflictCol = 'id') {
    console.log(`📡 Syncing Table: ${tableName}...`);
    
    // 1. Get Target Schema Columns
    const targetCols = await sqlTarget`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
    `.then(res => res.map(c => c.column_name));
    
    // 2. Get Source Data
    const data = await sqlSource`SELECT * FROM ${sqlSource(tableName)}`;
    console.log(`📊 Found ${data.length} records in ${tableName}.`);
    
    if (data.length === 0) return;

    // 3. Filter and Insert row-by-row for safety
    let count = 0;
    for (const row of data) {
        const filteredRow = {};
        targetCols.forEach(col => {
            if (row.hasOwnProperty(col)) {
                filteredRow[col] = row[col];
            }
        });

        // Safe mapping handled
        await sqlTarget`
            INSERT INTO ${sqlTarget(tableName)} ${sqlTarget(filteredRow)}
            ON CONFLICT (${sqlTarget(conflictCol)}) DO UPDATE SET ${sqlTarget(filteredRow)}
        `;
        count++;
        if (count % 100 === 0) console.log(`⏩ Progress: ${count}/${data.length}...`);
    }
    console.log(`✅ ${tableName} sync complete.`);
}

async function runPatch() {
    try {
        await patchSchema();
        await syncTable('dip_progress', 'id');
        await syncTable('wrp_progress', 'id');
        console.log('🎉 Patch complete! DIP and WRP progress tables are restored.');
    } catch (err) {
        console.error('❌ Patch Failed:', err);
    } finally {
        await sqlSource.end();
        await sqlTarget.end();
    }
}

runPatch();
