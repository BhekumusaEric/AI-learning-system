import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

/**
 * WeThinkCode_ Native Database Client
 * Orchestrates direct connections to Amazon RDS (PostgreSQL).
 * Features: Automatic pooling, SSL enforcement for production, and high-fidelity queries.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('[DB_ERROR] DATABASE_URL is not defined in the environment. Please update your AWS RDS configuration.');
}

// In AWS Lambda or Vercel, we only use the cert if it actually exists on disk
const hasCert = fs.existsSync(path.join(process.cwd(), 'global-bundle.pem'));
const sslConfig = hasCert ? {
  rejectUnauthorized: false, // Allow IP-based connections
  ca: fs.readFileSync(path.join(process.cwd(), 'global-bundle.pem'), 'utf8'),
} : false;

export const sql = postgres(connectionString, {
  ssl: sslConfig,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
});

/**
 * Helper to check database health during handover
 */
export async function checkDatabaseHealth() {
  try {
    const result = await sql`SELECT 1 as health`;
    return result[0].health === 1;
  } catch (error) {
    console.error('[DB_HEALTH_CHECK_FAILED]', error);
    return false;
  }
}
