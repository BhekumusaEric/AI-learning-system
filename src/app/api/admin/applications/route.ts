import { NextResponse } from 'next/server';
import { RawApplication, groupApplications } from '@/lib/applications';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

const EXTERNAL_API_URL = 'https://c66cbjnqn1.execute-api.af-south-1.amazonaws.com/idc/applications';
const ORIGIN_VERIFY_KEY = '01bde452-415d-4107-87e8-c36fa9747f52';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

export async function GET(request: Request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch external applications
    const response = await fetch(EXTERNAL_API_URL, {
      method: 'GET',
      headers: {
        'X-Origin-Verify': ORIGIN_VERIFY_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const json = await response.json();
    const rawApps: RawApplication[] = json.data || [];

    // 2. Fetch existing students to cross-check "freshness"
    const [saaioRes, dipRes, wrpRes] = await Promise.all([
      sql`SELECT email FROM saaio_students`,
      sql`SELECT email FROM dip_students`,
      sql`SELECT email FROM wrp_students`,
    ]);

    const existingEmailsMap: Record<string, Set<string>> = {
      saaio: new Set(saaioRes.map((s: any) => s.email?.toLowerCase().trim()).filter(Boolean)),
      dip: new Set(dipRes.map((s: any) => s.email?.toLowerCase().trim()).filter(Boolean)),
      wrp: new Set(wrpRes.map((s: any) => s.email?.toLowerCase().trim()).filter(Boolean)),
    };

    // 3. Group and flag "already enrolled" students
    const groups = groupApplications(rawApps, existingEmailsMap);

    return NextResponse.json({ groups, total: rawApps.length });
  } catch (error: any) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
