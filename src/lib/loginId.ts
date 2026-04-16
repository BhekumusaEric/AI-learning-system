import { supabase } from './supabase';

function formatLoginId(platform: string, index: number) {
  const prefix = platform === 'dip' ? 'DIP' : platform === 'wrp' ? 'WRP' : 'SAAIO';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(3, '0')}`;
}

/**
 * Returns the next login ID that does not already exist in the DB.
 * Starts from the highest existing numeric suffix + 1, then probes
 * upward until a free slot is confirmed — safe against deletions,
 * concurrent inserts, and count-based race conditions.
 */
export async function nextUniqueLoginId(platform: string): Promise<string> {
  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const prefix = platform === 'dip' ? 'DIP' : platform === 'wrp' ? 'WRP' : 'SAAIO';
  const year = new Date().getFullYear();

  // Fetch all existing login_ids for this year's prefix to find the true max
  const { data } = await supabase
    .from(table)
    .select('login_id')
    .like('login_id', `${prefix}-${year}-%`);

  const existingIds = new Set((data || []).map((r: any) => r.login_id as string));

  // Find the highest used index
  let maxIndex = 0;
  for (const id of existingIds) {
    const parts = id.split('-');
    const n = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(n) && n > maxIndex) maxIndex = n;
  }

  // Probe upward from max+1 until we find a slot not in the set
  let candidate = maxIndex + 1;
  while (existingIds.has(formatLoginId(platform, candidate))) {
    candidate++;
  }

  return formatLoginId(platform, candidate);
}

/**
 * Executes an insert callback function and retries with a new generated
 * login ID up to 5 times if a Postgres unique constraint violation occurs.
 */
export async function withUniqueLoginIdRetry(
  platformOrSupervisor: string, // 'dip' | 'saaio' | 'wrp' | 'supervisor'
  insertFn: (login_id: string) => Promise<{ error: any; [key: string]: any }>
): Promise<{ error: any; login_id: string; [key: string]: any }> {
  let retries = 5;

  while (retries > 0) {
    let login_id: string;

    if (platformOrSupervisor === 'supervisor') {
      const year = new Date().getFullYear();
      const { data: existing } = await supabase
        .from('supervisors')
        .select('login_id')
        .like('login_id', `SUP-${year}-%`);

      const ids = (existing || []).map((r: any) => r.login_id as string);
      let max = 0;
      for (const id of ids) {
        const n = parseInt(id.split('-').pop() || '0', 10);
        if (n > max) max = n;
      }
      login_id = `SUP-${year}-${String(max + 1).padStart(3, '0')}`;
    } else {
      login_id = await nextUniqueLoginId(platformOrSupervisor);
    }

    const result = await insertFn(login_id);

    if (!result.error) {
      return { ...result, login_id }; // Success!
    }

    // Check for Postgres unique constraint violation (code 23505) or duplicate key
    const msg = result.error.message || '';
    if (
      result.error.code === '23505' ||
      msg.includes('duplicate key') ||
      msg.includes('violates unique constraint')
    ) {
      retries--;
      if (retries === 0) {
        return { ...result, login_id: null as unknown as string };
      }
    } else {
      // Return immediately if it's some other non-retryable error
      return { ...result, login_id: null as unknown as string };
    }
  }

  return { error: { message: 'Max retries exceeded for generating unique login ID' }, login_id: null as unknown as string };
}
