import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { google } from 'googleapis';
import { jsPDF } from 'jspdf';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

const FOLDER_IDS: Record<string, string> = {
  wrp: process.env.GOOGLE_DRIVE_WRP_FOLDER_ID!,
  dip: process.env.GOOGLE_DRIVE_DIP_FOLDER_ID!,
};

function getDriveClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
  const key = JSON.parse(raw);
  if (key.private_key) key.private_key = key.private_key.replace(/\\n/g, '\n');
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

async function uploadToDrive(pdfBuffer: Buffer, fileName: string, platform: string) {
  const folderId = FOLDER_IDS[platform];
  if (!folderId) return;
  const drive = getDriveClient();

  // Delete existing file with same name to overwrite
  const existing = await drive.files.list({
    q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  for (const file of existing.data.files || []) {
    await drive.files.delete({ fileId: file.id!, supportsAllDrives: true } as any);
  }

  await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/pdf',
    },
    media: { mimeType: 'application/pdf', body: Readable.from(pdfBuffer) },
    fields: 'id',
  });
}

// POST /api/admin/save-certificate
// Body: { imageBase64, fileName, platform, login_id }
export async function POST(request: Request) {
  try {
    const { imageBase64, fileName, platform, login_id } = await request.json();
    if (!imageBase64 || !fileName) {
      return NextResponse.json({ error: 'imageBase64 and fileName required' }, { status: 400 });
    }

    // Build PDF server-side from the image
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    pdf.addImage(`data:image/jpeg;base64,${imageBase64}`, 'JPEG', 0, 0, pdfW, pdfH);
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Upload to Supabase and Google Drive in parallel
    const [supabaseResult] = await Promise.allSettled([
      supabase.storage.from('certificates').upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      }),
      uploadToDrive(pdfBuffer, fileName, platform),
    ]);

    if (supabaseResult.status === 'rejected') {
      console.error('Supabase upload failed:', supabaseResult.reason);
      return NextResponse.json({ error: 'Supabase upload failed' }, { status: 500 });
    }

    if (supabaseResult.value.error) {
      return NextResponse.json({ error: supabaseResult.value.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, fileName });
  } catch (e: any) {
    console.error('Certificate save failed:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
