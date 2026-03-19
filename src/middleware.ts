import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';

function sessionToken(password: string) {
  return createHash('sha256').update('admin_session:' + password).digest('hex');
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    if (url.pathname === '/admin/login') return NextResponse.next();

    const session = req.cookies.get('admin_session')?.value;
    const expected = sessionToken(process.env.ADMIN_PASSWORD || 'supersecret');
    if (session !== expected) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
