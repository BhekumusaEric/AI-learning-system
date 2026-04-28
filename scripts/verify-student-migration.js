const postgres = require('postgres');

const DATABASE_URL = "postgres://bhntshwcjc025:EricKelvin2025@saaio-db-capetown.c9u046kgwwaf.af-south-1.rds.amazonaws.com:5432/postgres?sslmode=no-verify";

async function audit() {
    const sql = postgres(DATABASE_URL);
    
    try {
        console.log("🔍 Auditing student record SAAIO-2026-001...");
        const students = await sql`SELECT student_id, name, email FROM saaio_students WHERE student_id = 'SAAIO-2026-001'`;
        
        if (students.length === 0) {
            console.log("❌ SAAIO-2026-001 NOT FOUND in Cape Town!");
            
            console.log("📊 Counting all students in saaio_students...");
            const counts = await sql`SELECT COUNT(*) FROM saaio_students`;
            console.log(`Summary: Found ${counts[0].count} total students in table.`);
        } else {
            console.log("✅ SAAIO-2026-001 EXISTS:", students[0]);
        }
        
    } catch (error) {
        console.error("❌ Audit Failed:", error.message);
    } finally {
        await sql.end();
    }
}

audit();
