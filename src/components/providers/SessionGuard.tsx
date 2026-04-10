"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // check every 5 minutes

export default function SessionGuard({ platform }: { platform: 'dip' | 'wrp' }) {
  const router = useRouter();
  const pathname = usePathname();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loginPath = `/${platform}/login`;

  const logout = (reason: string) => {
    const loginId = localStorage.getItem('ioai_user');
    localStorage.removeItem('ioai_user');
    localStorage.removeItem('ioai_name');
    localStorage.removeItem('ioai_session');
    localStorage.removeItem('ioai_session_expires');
    if (loginId) localStorage.removeItem(`integrity_agreed_${loginId}`);
    router.replace(`${loginPath}?reason=${reason}`);
  };

  const checkSession = async () => {
    const loginId = localStorage.getItem('ioai_user');
    const token = localStorage.getItem('ioai_session');
    const expires = localStorage.getItem('ioai_session_expires');

    if (!loginId) { logout('no_session'); return; }
    // If no token yet (logged in before session feature), let them through
    if (!token) return;

    // Client-side expiry check first (fast)
    if (expires && new Date(expires) < new Date()) { logout('expired'); return; }

    // Server-side validation
    try {
      const res = await fetch(`/api/auth/session?login_id=${loginId}&token=${token}`);
      const data = await res.json();
      if (!data.valid) logout(data.reason || 'invalid');
    } catch {
      // Network error — don't log out, just skip this check
    }
  };

  useEffect(() => {
    // Skip on login page itself
    if (pathname === loginPath) return;

    // Check immediately on mount
    checkSession();

    // Then check every 5 minutes
    intervalRef.current = setInterval(checkSession, CHECK_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [pathname]);

  return null;
}
