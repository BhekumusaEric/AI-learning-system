import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/admin_session=([^;]+)/);
  const session = m ? decodeURIComponent(m[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

function genToken() {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// GET — list all invite links
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .from('invite_links')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST — create a new invite link
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { type, platform, label, expires_at, max_uses } = await request.json();
  if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 });

  // Unique token with collision check
  let token = genToken();
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase.from('invite_links').select('id').eq('token', token).maybeSingle();
    if (!existing) break;
    token = genToken();
  }

  const { data, error } = await supabase
    .from('invite_links')
    .insert({ token, type, platform: platform || null, label: label || null, expires_at: expires_at || null, max_uses: max_uses || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — refresh token or update expiry/label
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, refresh, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (refresh) {
    let token = genToken();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabase.from('invite_links').select('id').eq('token', token).maybeSingle();
      if (!existing) break;
      token = genToken();
    }
    updates.token = token;
    updates.use_count = 0;
    updates.revoked = false;
  }

  const { data, error } = await supabase.from('invite_links').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — revoke (soft) or hard delete
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const hard = searchParams.get('hard') === 'true';
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (hard) {
    await supabase.from('invite_links').delete().eq('id', id);
  } else {
    await supabase.from('invite_links').update({ revoked: true }).eq('id', id);
  }
  return NextResponse.json({ success: true });
}
