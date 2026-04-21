const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

async function runSmokeTest() {
    console.log('🔍 Starting Pipeline Smoke Test...');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ DATABASE_URL is missing!');
        process.exit(1);
    }

    const sql = postgres(dbUrl, {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync(path.join(process.cwd(), 'global-bundle.pem'), 'utf8')
        },
        connect_timeout: 5
    });

    try {
        console.log('📡 Testing Database Connection...');
        const result = await sql`SELECT 1 as connected`;
        if (result[0].connected === 1) {
            console.log('✅ Database is reachable and responding.');
        } else {
            throw new Error('Unexpected database response');
        }

        console.log('🛡️ Verification Complete: Environment is stable.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Smoke Test Failed:', err.message);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

runSmokeTest();
