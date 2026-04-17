import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  if (!session?.startsWith('admin:')) return false;
  return true;
}

// GET — list all admins
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .from('admins')
    .select('id, username, full_name, created_at')
    .order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST — create new admin
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { username, password, full_name } = await request.json();
  if (!username || !password || !full_name) {
    return NextResponse.json({ error: 'username, password and full_name required' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('admins')
    .insert({ username, password_hash: hashPassword(password), full_name })
    .select('id, username, full_name, created_at')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — update username or password
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, username, password, full_name } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const updates: Record<string, string> = {};
  if (username) updates.username = username;
  if (full_name) updates.full_name = full_name;
  if (password) updates.password_hash = hashPassword(password);
  const { error } = await supabase.from('admins').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — remove admin
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  // Prevent deleting last admin
  const { count } = await supabase.from('admins').select('*', { count: 'exact', head: true });
  if ((count || 0) <= 1) return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 });
  const { error } = await supabase.from('admins').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
