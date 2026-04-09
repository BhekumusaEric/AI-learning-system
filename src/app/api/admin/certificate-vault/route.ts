import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';

export const dynamic = 'force-dynamic';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// GET ?platform=wrp — list files
// GET ?platform=wrp&file=filename.pdf — download a single file
// GET ?platform=wrp&bulk=true — download all as zip
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as 'dip' | 'wrp' | null;
  const file = searchParams.get('file');
  const bulk = searchParams.get('bulk') === 'true';

  if (!platform) return NextResponse.json({ error: 'platform required' }, { status: 400 });

  const prefix = platform === 'wrp' ? 'WRP-Certificate-' : 'IDC-DIP-Certificate-';

  // Download a specific file
  if (file) {
    const { data, error } = await supabase.storage.from('certificates').download(file);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const buffer = await data.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file}"`,
      },
    });
  }

  // List files for this platform
  const { data, error } = await supabase.storage.from('certificates').list('', {
    limit: 500,
    sortBy: { column: 'updated_at', order: 'desc' },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filtered = (data || []).filter(f => f.name.startsWith(prefix));

  // Bulk download as zip
  if (bulk) {
    const zip = new JSZip();
    await Promise.all(
      filtered.map(async f => {
        const { data: fileData, error: fileError } = await supabase.storage.from('certificates').download(f.name);
        if (!fileError && fileData) {
          zip.file(f.name, await fileData.arrayBuffer());
        }
      })
    );
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    const zipName = `${platform.toUpperCase()}-Certificates-${new Date().toISOString().slice(0, 10)}.zip`;
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
      },
    });
  }

  return NextResponse.json(filtered.map(f => ({ name: f.name, updated_at: f.updated_at })));
}
