const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

const connectionString = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db.cvguww60mq70.eu-north-1.rds.amazonaws.com:5432/postgres";

async function test() {
    console.log('Reading SSL certificate...');
    const ca = fs.readFileSync(path.join(process.cwd(), 'global-bundle.pem'), 'utf8');

    const sql = postgres(connectionString, {
        connect_timeout: 10,
        ssl: {
            rejectUnauthorized: true,
            ca: ca
        }
    });

    try {
        console.log('Attempting to connect to RDS with SSL...');
        const result = await sql`SELECT 1 as connected`;
        console.log('✅ Connection successful:', result);
    } catch (err) {
        console.error('❌ Connection failed. Check if RDS is publicly accessible and Security Group allows port 5432.');
        console.error(err);
    } finally {
        await sql.end();
    }
}
test();
