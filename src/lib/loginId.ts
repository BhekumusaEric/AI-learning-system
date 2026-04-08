import { sql } from './db';

function formatLoginId(platform: string, index: number) {
  const prefix = platform === 'dip' ? 'DIP' : platform === 'wrp' ? 'WRP' : 'SAAIO';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(3, '0')}`;
}

/**
 * Returns the next login ID that does not already exist in the DB.
 */
export async function nextUniqueLoginId(platform: string): Promise<string> {
  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const prefix = platform === 'dip' ? 'DIP' : platform === 'wrp' ? 'WRP' : 'SAAIO';
  const year = new Date().getFullYear();

  // Fetch all existing login_ids for this year's prefix
  const data = await sql`
    SELECT login_id FROM ${sql(table)} 
    WHERE login_id LIKE ${prefix + '-' + year + '-%'}
  `;

  const existingIds = new Set(data.map((r: any) => r.login_id as string));

  let maxIndex = 0;
  for (const id of existingIds) {
    const parts = id.split('-');
    const n = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(n) && n > maxIndex) maxIndex = n;
  }

  let candidate = maxIndex + 1;
  while (existingIds.has(formatLoginId(platform, candidate))) {
    candidate++;
  }

  return formatLoginId(platform, candidate);
}
