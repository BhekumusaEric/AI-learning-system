import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { login_id, page_id, colab_url } = await request.json();

    if (!login_id || !page_id || !colab_url) {
      return NextResponse.json({ error: 'login_id, page_id and colab_url are required' }, { status: 400 });
    }

    // Upsert the submission in native Postgres
    await sql`
      INSERT INTO notebook_submissions (login_id, page_id, colab_url, submitted_at)
      VALUES (${login_id}, ${page_id}, ${colab_url}, NOW())
      ON CONFLICT (login_id, page_id)
      DO UPDATE SET 
        colab_url = EXCLUDED.colab_url,
        submitted_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
