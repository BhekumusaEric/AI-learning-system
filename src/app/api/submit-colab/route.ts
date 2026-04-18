import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { login_id, page_id, colab_url } = await request.json();

    if (!login_id || !page_id || !colab_url) {
      return NextResponse.json({ error: 'login_id, page_id and colab_url are required' }, { status: 400 });
    }

    // Upsert the submission
    const { error } = await supabase
      .from('notebook_submissions')
      .upsert(
        { 
          login_id, 
          page_id, 
          colab_url, 
          submitted_at: new Date().toISOString() 
        },
        { onConflict: 'login_id,page_id' }
      );

    if (error) {
      console.error('Error submitting colab URL:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
