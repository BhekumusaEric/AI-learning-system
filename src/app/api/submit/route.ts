import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
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

  const normCode = normaliseCode(code);
  const code_hash = createHash('sha256').update(normCode).digest('hex');

  // Skip duplicate detection for simple challenges that are meant to be identical
  // (e.g. less than 150 non-whitespace chars) or specifically the hello world
  const isTrivial = page_id.includes('hello_world') || normCode.length < 150;

  let duplicate = false;
  let matchedStudents: string[] = [];

  if (!isTrivial) {
    // Check if any OTHER student submitted identical code for this page
    const matches = await sql`
      SELECT login_id FROM dip_submissions
      WHERE page_id = ${page_id}
        AND code_hash = ${code_hash}
        AND login_id != ${login_id}
    `;

    duplicate = matches.length > 0;
    matchedStudents = matches.map((m: any) => m.login_id);
  }

  // Upsert this student's submission
  await sql`
    INSERT INTO dip_submissions (login_id, page_id, code_hash, submitted_at)
    VALUES (${login_id}, ${page_id}, ${code_hash}, ${new Date().toISOString()})
    ON CONFLICT (login_id, page_id)
    DO UPDATE SET code_hash = ${code_hash}, submitted_at = ${new Date().toISOString()}
  `;

  // If duplicate, flag it in audit log
  if (duplicate) {
    await sql`
      INSERT INTO admin_audit_log (admin_username, action, target_login_id, target_platform, details)
      VALUES ('system', 'duplicate_code_detected', ${login_id}, 'dip', ${JSON.stringify({ page_id, matched_students: matchedStudents })})
    `;
  }

  return NextResponse.json({ duplicate, matchedStudents });
}
