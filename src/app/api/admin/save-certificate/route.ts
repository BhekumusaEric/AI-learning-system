import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

const FOLDER_ID = process.env.GOOGLE_DRIVE_CERT_FOLDER_ID!;

function getDriveClient() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return google.drive({ version: 'v3', auth });
}

// POST /api/admin/save-certificate
// Body: { pdfBase64, fileName }
export async function POST(request: Request) {
  try {
    const { pdfBase64, fileName } = await request.json();
    if (!pdfBase64 || !fileName) {
      return NextResponse.json({ error: 'pdfBase64 and fileName required' }, { status: 400 });
    }

    const drive = getDriveClient();
    const buffer = Buffer.from(pdfBase64, 'base64');
    const stream = Readable.from(buffer);

    const res = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [FOLDER_ID],
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      fields: 'id, name',
    });

    return NextResponse.json({ success: true, fileId: res.data.id, fileName: res.data.name });
  } catch (e: any) {
    console.error('Drive upload failed:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
