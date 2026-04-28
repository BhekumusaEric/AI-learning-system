import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';
import { nextUniqueLoginId, withUniqueLoginIdRetry } from '@/lib/loginId';

export const dynamic = 'force-dynamic';

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function hashPassword(p: string) { return createHash('sha256').update(p).digest('hex'); }

async function validateToken(token: string) {
  try {
    const data = await sql`
      SELECT * FROM invite_links WHERE token = ${token}
    `;

    if (data.length === 0) return { valid: false, reason: 'Invalid link' };
    const link = data[0];

    if (link.revoked) return { valid: false, reason: 'This link has been revoked' };
    if (link.expires_at && new Date(link.expires_at) < new Date()) return { valid: false, reason: 'This link has expired' };
    if (link.max_uses !== null && link.use_count >= link.max_uses) return { valid: false, reason: 'This link has reached its maximum number of uses' };
    
    return { valid: true, link };
  } catch (error) {
    return { valid: false, reason: 'Error validating link' };
  }
}

// GET — validate token and return link metadata (no sensitive data)
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { valid, reason, link } = await validateToken(token);
  if (!valid || !link) return NextResponse.json({ error: reason || 'Invalid link' }, { status: 410 });

  return NextResponse.json({
    type: link.type,
    platform: link.platform,
    label: link.label,
    expires_at: link.expires_at,
    max_uses: link.max_uses,
    use_count: link.use_count,
  });
}

// POST — submit registration
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { valid, reason, link } = await validateToken(token);
  if (!valid || !link) return NextResponse.json({ error: reason || 'Invalid link' }, { status: 410 });

  const body = await request.json();

  try {
    if (link.type === 'supervisor') {
      const { full_name, email, platform } = body;
      if (!full_name?.trim() || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

      const plainPassword = generatePassword();
      const { data, error, login_id } = await withUniqueLoginIdRetry('supervisor', async (generated_id) => {
        try {
          const result = await sql`
            INSERT INTO supervisors (login_id, password, name, email, platform)
            VALUES (${generated_id}, ${hashPassword(plainPassword)}, ${full_name.trim()}, ${email?.trim() || null}, ${platform})
            RETURNING login_id as id, login_id, name as full_name
          `;
          return { error: null, data: result[0] };
        } catch (e: any) {
          return { error: e };
        }
      });
      if (error) throw error;

      // 3. Increment use_count
      await sql`UPDATE invite_links SET use_count = use_count + 1 WHERE id = ${link.id}`;

      return NextResponse.json({ ...data, plainPassword, type: 'supervisor' });
    }

    if (link.type === 'student') {
      const { full_name, email, platform } = body;
      if (!full_name?.trim() || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

      const allowed = link.platform;
      if (allowed && allowed !== 'both' && allowed !== platform) {
        return NextResponse.json({ error: 'Invalid platform for this link' }, { status: 400 });
      }

      const table = platform === 'wrp' ? 'wrp_students' : platform === 'dip' ? 'dip_students' : 'saaio_students';
      const plainPassword = generatePassword();

      const idColumn = platform === 'saaio' ? 'student_id' : 'login_id';
      const { data, error, login_id } = await withUniqueLoginIdRetry(platform, async (generated_id) => {
        try {
          const result = await sql`
            INSERT INTO ${sql(table)} (${sql(idColumn)}, password, name, email)
            VALUES (${generated_id}, ${hashPassword(plainPassword)}, ${full_name.trim()}, ${email?.trim() || null})
            RETURNING ${sql(idColumn)} as id, ${sql(idColumn)} as login_id, name as full_name
          `;
          return { error: null, data: result[0] };
        } catch (e: any) {
          return { error: e };
        }
      });
      if (error) throw error;

      await sql`UPDATE invite_links SET use_count = use_count + 1 WHERE id = ${link.id}`;

      return NextResponse.json({ ...data, plainPassword, type: 'student', platform });
    }

    return NextResponse.json({ error: 'Unknown link type' }, { status: 400 });
  } catch (error: any) {
    console.error('[REGISTRATION_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
