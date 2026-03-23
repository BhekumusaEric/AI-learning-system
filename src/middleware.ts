import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge-compatible token: just a fixed prefix + the raw password env var.
// The login route sets this same value into the cookie.
function expectedToken() {
  return 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    if (url.pathname === '/admin/login') return NextResponse.next();

    const session = req.cookies.get('admin_session')?.value;
    if (session !== expectedToken()) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
