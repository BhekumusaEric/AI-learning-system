import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  const tables = ['saaio_students', 'dip_students', 'dip_progress', 'user_progress'];

  for (const table of tables) {
    try {
      const [{ count }] = await sql`SELECT COUNT(*) as count FROM ${sql(table)}`;
      const sample = await sql`SELECT * FROM ${sql(table)} LIMIT 3`;
      results[table] = { count: Number(count), sample };
    } catch (e: any) {
      results[table] = { error: e.message };
    }
  }

  return NextResponse.json(results);
}
