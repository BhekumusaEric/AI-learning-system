import { sql } from '@/lib/db';

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
    
    // Extract username from DB
    const admins = await sql`SELECT username FROM admins LIMIT 1`;
    const admin_username = admins.length > 0 ? admins[0].username : 'admin';

    await sql`
      INSERT INTO admin_audit_log (admin_username, action, details)
      VALUES (${admin_username}, ${action}, ${sql(details || {})})
    `;
  } catch (error) {
    console.error('[AUDIT_LOG_FAILED]', error);
    // Audit logging should never break the main action
  }
}
