import { sql } from './src/lib/db.js';
import { nextUniqueLoginId, withUniqueLoginIdRetry } from './src/lib/loginId.js';

async function main() {
  try {
    // We will attempt to trigger a unique constraint violation manually
    // to see the EXACT error structure returned by postgres package.
    const platform = 'dip';
    const table = 'dip_students';
    const generated_id = 'DIP-TEST-999';

    // first clean up
    await sql`DELETE FROM dip_students WHERE login_id = ${generated_id}`;

    console.log("Inserting first time...");
    await sql`
      INSERT INTO dip_students (login_id, password_hash, full_name, email)
      VALUES (${generated_id}, 'hash', 'Test', 'test@test.com')
    `;

    console.log("Inserting second time (should duplicate)...");
    try {
      await sql`
        INSERT INTO dip_students (login_id, password_hash, full_name, email)
        VALUES (${generated_id}, 'hash', 'Test', 'test2@test.com')
      `;
    } catch (e) {
      console.log("CAUGHT ERROR:", e);
      console.log("e.code:", e.code);
      console.log("e.message:", e.message);
      
      const msg = e.message || '';
      const shouldRetry = e.code === '23505' ||
      msg.includes('duplicate key') ||
      msg.includes('violates unique constraint');

      console.log("Should Retry?", shouldRetry);
    }

    // clean up
    await sql`DELETE FROM dip_students WHERE login_id = ${generated_id}`;
    
  } catch (err) {
    console.error("Fatal:", err);
  } finally {
    process.exit(0);
  }
}

main();
