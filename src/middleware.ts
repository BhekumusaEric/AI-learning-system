import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  if (url.pathname.startsWith('/supervisor')) {
    if (url.pathname === '/supervisor/login') return NextResponse.next();
    const supervisorId = req.cookies.get('supervisor_id')?.value;
    if (!supervisorId) {
      return NextResponse.redirect(new URL('/supervisor/login', req.url));
    }
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/supervisor', '/supervisor/:path*'],
};
