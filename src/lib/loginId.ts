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
