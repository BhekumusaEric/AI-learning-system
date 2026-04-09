import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function normaliseCode(code: string): string {
  // Strip comments, collapse whitespace so minor formatting differences don't fool the check
  return code
    .replace(/#.*$/gm, '')        // remove comments
    .replace(/\s+/g, ' ')         // collapse whitespace
    .trim()
    .toLowerCase();
}

// POST /api/submit
// Body: { login_id, page_id, code }
// Returns: { duplicate: boolean, matchedStudents?: string[] }
export async function POST(request: Request) {
  const { login_id, page_id, code } = await request.json();
  if (!login_id || !page_id || !code) {
    return NextResponse.json({ error: 'login_id, page_id and code required' }, { status: 400 });
  }

  const code_hash = createHash('sha256').update(normaliseCode(code)).digest('hex');

  // Check if any OTHER student submitted identical code for this page
  const { data: matches } = await supabase
    .from('dip_submissions')
    .select('login_id')
    .eq('page_id', page_id)
    .eq('code_hash', code_hash)
    .neq('login_id', login_id);

  const duplicate = !!(matches && matches.length > 0);
  const matchedStudents = matches?.map(m => m.login_id) || [];

  // Upsert this student's submission
  await supabase.from('dip_submissions').upsert(
    { login_id, page_id, code_hash, submitted_at: new Date().toISOString() },
    { onConflict: 'login_id,page_id' }
  );

  // If duplicate, flag it in audit log
  if (duplicate) {
    await supabase.from('admin_audit_log').insert({
      admin_username: 'system',
      action: 'duplicate_code_detected',
      target_login_id: login_id,
      target_platform: 'dip',
      details: { page_id, matched_students: matchedStudents },
    });
  }

  return NextResponse.json({ duplicate, matchedStudents });
}
