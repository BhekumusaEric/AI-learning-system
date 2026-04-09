import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';

export const dynamic = 'force-dynamic';

// POST /api/admin/save-certificate
// Body: { imageBase64, fileName, platform }
export async function POST(request: Request) {
  try {
    const { imageBase64, fileName } = await request.json();
    if (!imageBase64 || !fileName) {
      return NextResponse.json({ error: 'imageBase64 and fileName required' }, { status: 400 });
    }

    // Build PDF server-side from the image
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    pdf.addImage(`data:image/jpeg;base64,${imageBase64}`, 'JPEG', 0, 0, pdfW, pdfH);
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Upload to Supabase Storage, overwrite if exists
    const { error } = await supabase.storage
      .from('certificates')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, fileName });
  } catch (e: any) {
    console.error('Certificate save failed:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
