import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  const tables = ['saaio_students', 'dip_students', 'dip_progress', 'user_progress'];

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .limit(3);

    results[table] = error
      ? { error: error.message, code: error.code }
      : { count, sample: data };
  }

  return NextResponse.json(results);
}
