const { Client } = require('pg');

const connectionString = 'postgresql://postgres:EricKelvin%402025@db.hzldgvdtgkebfotpkjpt.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function setup() {
  try {
    await client.connect();
    console.log("🔌 Connected to Supabase PostgreSQL.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS notebook_submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          login_id TEXT NOT NULL,
          page_id TEXT NOT NULL,
          colab_url TEXT NOT NULL,
          submitted_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(login_id, page_id)
      );
    `);
    console.log("✅ Table 'notebook_submissions' created or verified.");

  } catch (error) {
    console.error("❌ Error setting up database:", error);
  } finally {
    await client.end();
    console.log("🔌 Disconnected from Supabase.");
  }
}

setup();
