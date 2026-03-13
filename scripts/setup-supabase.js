const { Client } = require('pg');

const connectionString = 'postgresql://postgres:EricKelvin%402025@db.hzldgvdtgkebfotpkjpt.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function setup() {
  try {
    await client.connect();
    console.log("🔌 Connected to Supabase PostgreSQL.");

    // Create the user_progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
          username TEXT PRIMARY KEY,
          completed_pages JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'user_progress' created or verified.");

  } catch (error) {
    console.error("❌ Error setting up database:", error);
  } finally {
    await client.end();
    console.log("🔌 Disconnected from Supabase.");
  }
}

setup();
