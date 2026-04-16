import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { nextUniqueLoginId, withUniqueLoginIdRetry } from '@/lib/loginId';

export const dynamic = 'force-dynamic';

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function hashPassword(p: string) { return createHash('sha256').update(p).digest('hex'); }

async function validateToken(token: string) {
  const { data, error } = await supabase
    .from('invite_links')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error || !data) return { valid: false, reason: 'Invalid link' };
  if (data.revoked) return { valid: false, reason: 'This link has been revoked' };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, reason: 'This link has expired' };
  if (data.max_uses !== null && data.use_count >= data.max_uses) return { valid: false, reason: 'This link has reached its maximum number of uses' };
  return { valid: true, link: data };
}

// GET — validate token and return link metadata (no sensitive data)
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { valid, reason, link } = await validateToken(token);
  if (!valid) return NextResponse.json({ error: reason }, { status: 410 });
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
  if (!valid) return NextResponse.json({ error: reason }, { status: 410 });

  const body = await request.json();

  if (link.type === 'supervisor') {
    const { full_name, email, platform } = body;
    if (!full_name?.trim() || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

    const plainPassword = generatePassword();
    const { data, error, login_id } = await withUniqueLoginIdRetry('supervisor', async (generated_id) => {
      return await supabase
        .from('supervisors')
        .insert({ login_id: generated_id, password_hash: hashPassword(plainPassword), full_name: full_name.trim(), email: email?.trim() || null, platform })
        .select('id, login_id, full_name')
        .single();
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('invite_links').update({ use_count: (link.use_count || 0) + 1 }).eq('id', link.id);
    return NextResponse.json({ ...data, plainPassword, type: 'supervisor' });
  }

  if (link.type === 'student') {
    const { full_name, email, platform } = body;
    if (!full_name?.trim() || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

    // Validate platform against link's allowed platform
    const allowed = link.platform;
    if (allowed && allowed !== 'both' && allowed !== platform) {
      return NextResponse.json({ error: 'Invalid platform for this link' }, { status: 400 });
    }

    const table = platform === 'wrp' ? 'wrp_students' : platform === 'dip' ? 'dip_students' : 'saaio_students';
    const plainPassword = generatePassword();

    const { data, error, login_id } = await withUniqueLoginIdRetry(platform, async (generated_id) => {
      return await supabase
        .from(table)
        .insert({ login_id: generated_id, password_hash: hashPassword(plainPassword), full_name: full_name.trim(), email: email?.trim() || null })
        .select('id, login_id, full_name')
        .single();
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('invite_links').update({ use_count: (link.use_count || 0) + 1 }).eq('id', link.id);
    return NextResponse.json({ ...data, plainPassword, type: 'student', platform });
  }

  return NextResponse.json({ error: 'Unknown link type' }, { status: 400 });
}
