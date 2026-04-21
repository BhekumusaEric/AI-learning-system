import { withUniqueLoginIdRetry } from './src/lib/loginId.js';
import { sql } from './src/lib/db.js';
import { createHash } from 'crypto';

const TIMESTAMP = Date.now();
const PREFIX = `test-${TIMESTAMP}`;

function hashPassword(p) {
  return createHash('sha256').update(p).digest('hex');
}

async function main() {
  console.log("Starting concurrency test...");

  // Spawns N simultaneous registration requests simulating high parallel usage load.
  const numRequests = 20;
  const requests = Array.from({ length: numRequests }).map(async (_, i) => {
    return withUniqueLoginIdRetry('dip', async (generated_id, trx) => {
      try {
        const full_name = `Test User ${PREFIX} ${i}`;
        const email = `${PREFIX}-${i}@test.com`;
        const password_hash = hashPassword('password');

        await trx`
          INSERT INTO dip_students (login_id, password_hash, full_name, email)
          VALUES (${generated_id}, ${password_hash}, ${full_name}, ${email})
        `;
        return { error: null };
      } catch (e) {
        return { error: e };
      }
    });
  });

  console.log(`Fired ${numRequests} concurrent requests. Waiting for completion...`);
  const results = await Promise.all(requests);

  const successes = results.filter(r => !r.error);
  const failures = results.filter(r => r.error);

  console.log(`\n===================\nRESULTS:`);
  console.log(`Successes: ${successes.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`===================\n`);

  if (failures.length > 0) {
    console.error("Some requests failed!");
    console.error(failures[0].error.message);
  } else {
    console.log("SUCCESS! All concurrent requests successfully obtained unique IDs and inserted without constraint violations!");
  }

  // Cleanup testing entries
  console.log("Cleaning up test data...");
  await sql`DELETE FROM dip_students WHERE email LIKE ${PREFIX + '-%'}`;
  console.log("Cleanup done.");

  process.exit(0);
}

main().catch(e => {
  console.error("Fatal:", e);
  process.exit(1);
});
