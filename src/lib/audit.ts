import { supabase } from '@/lib/supabase';

export async function logAudit({
  request,
  action,
  target_login_id,
  target_platform,
  details,
}: {
  request: Request;
  action: string;
  target_login_id?: string;
  target_platform?: string;
  details?: Record<string, any>;
}) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/admin_session=([^;]+)/);
    const session = match ? decodeURIComponent(match[1]) : null;
    // Extract username from DB by matching session token
    const { data: admins } = await supabase.from('admins').select('username');
    // We can't reverse the hash so just log 'admin' — in future bind username to session
    const admin_username = admins?.length === 1 ? admins[0].username : 'admin';

    await supabase.from('admin_audit_log').insert({
      admin_username,
      action,
      target_login_id: target_login_id || null,
      target_platform: target_platform || null,
      details: details || null,
    });
  } catch {
    // Audit logging should never break the main action
  }
}
