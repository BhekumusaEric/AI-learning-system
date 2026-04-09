import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { jsPDF } from 'jspdf';

export const dynamic = 'force-dynamic';

const FOLDER_ID = process.env.GOOGLE_DRIVE_CERT_FOLDER_ID!;

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

    const drive = getDriveClient();
    const stream = Readable.from(pdfBuffer);

    // Delete existing file with same name to overwrite
    const existing = await drive.files.list({
      q: `name='${fileName}' and '${FOLDER_ID}' in parents and trashed=false`,
      fields: 'files(id)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    for (const file of existing.data.files || []) {
      await drive.files.delete({ fileId: file.id!, supportsAllDrives: true } as any);
    }

    const res = await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: fileName,
        parents: [FOLDER_ID],
        mimeType: 'application/pdf',
      },
      media: { mimeType: 'application/pdf', body: stream },
      fields: 'id, name',
    });

    return NextResponse.json({ success: true, fileId: res.data.id, fileName: res.data.name });
  } catch (e: any) {
    console.error('Drive upload failed:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
