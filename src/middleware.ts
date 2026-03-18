import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    // Allow the login page through
    if (url.pathname === '/admin/login') return NextResponse.next();

    // Check for admin session cookie
    const session = req.cookies.get('admin_session')?.value;
    if (session !== (process.env.ADMIN_PASSWORD || 'supersecret')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
