import { sql } from './db';

function formatLoginId(platform: string, index: number) {
  const prefix = platform === 'dip' ? 'DIP' : platform === 'wrp' ? 'WRP' : 'SAAIO';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(3, '0')}`;
}

/**
 * Executes an insert callback function inside a transaction with an advisory lock.
 * This guarantees sequential evaluation of the maximum login ID for the specified platform,
 * totally eliminating Postgres unique constraint violation duplicate key errors.
 */
export async function withUniqueLoginIdRetry(
  platformOrSupervisor: string, // 'dip' | 'saaio' | 'wrp' | 'supervisor'
  insertFn: (login_id: string, trx: any) => Promise<{ error: any; [key: string]: any }>
): Promise<{ error: any; login_id: string; [key: string]: any }> {
  
  // Deterministic lock identifiers for different pools
  const lockIds: Record<string, number> = {
    dip: 1001,
    wrp: 1002,
    saaio: 1003,
    supervisor: 1004,
  };
  const lockId = lockIds[platformOrSupervisor] || 9999;

  try {
    return await sql.begin(async (trx: any) => {
      // 1. Obtain a transaction-level advisory lock
      await trx`SELECT pg_advisory_xact_lock(${lockId})`;

      // 2. Safely generate a unique ID
      let login_id: string;

      if (platformOrSupervisor === 'supervisor') {
        const year = new Date().getFullYear();
        const existing = await trx`
          SELECT login_id FROM supervisors
          WHERE login_id LIKE ${'SUP-' + year + '-%'}
        `;

        const ids: string[] = (existing || []).map((r: any) => r.login_id as string);
        let max = 0;
        for (const id of ids) {
          const n = parseInt(id.split('-').pop() || '0', 10);
          if (n > max) max = n;
        }
        login_id = `SUP-${year}-${String(max + 1).padStart(3, '0')}`;
      } else {
        const table = platformOrSupervisor === 'dip' ? 'dip_students' : platformOrSupervisor === 'wrp' ? 'wrp_students' : 'saaio_students';
        const prefix = platformOrSupervisor === 'dip' ? 'DIP' : platformOrSupervisor === 'wrp' ? 'WRP' : 'SAAIO';
        const year = new Date().getFullYear();

        const data = await trx`
          SELECT login_id FROM ${trx(table)} 
          WHERE login_id LIKE ${prefix + '-' + year + '-%'}
        `;

        const existingIds: Set<string> = new Set(data.map((r: any) => r.login_id as string));
        let maxIndex = 0;
        for (const id of existingIds) {
          const parts = id.split('-');
          const n = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(n) && n > maxIndex) maxIndex = n;
        }

        let candidate = maxIndex + 1;
        while (existingIds.has(formatLoginId(platformOrSupervisor, candidate))) {
          candidate++;
        }
        login_id = formatLoginId(platformOrSupervisor, candidate);
      }

      // 3. Insert using the generated ID with the transaction object `trx`
      const result = await insertFn(login_id, trx);

      if (!result.error) {
        return { ...result, login_id }; // Success! Transaction commits.
      } else {
        // Rollback the transaction safely by throwing
        throw result.error;
      }
    });
  } catch (error: any) {
    return { error, login_id: null as unknown as string };
  }
}
