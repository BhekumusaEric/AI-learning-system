import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';

/**
 * WeThinkCode_ Native Authentication Orchestrator
 * This replaces Supabase Auth with a professional, self-hosted NextAuth solution.
 */

function hashPassword(p: string) {
  return createHash('sha256').update(p).digest('hex');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'WeThinkCode_ Login',
      credentials: {
        login_id: { label: "Login ID", type: "text" },
        password: { label: "Password", type: "password" },
        platform: { label: "Platform", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.login_id || !credentials?.password || !credentials?.platform) {
          return null;
        }

        const { login_id, password, platform } = credentials;
        const normalized_id = login_id.trim().toUpperCase();

        // 1. Handle Admin/Supervisor Auth (if platform is 'admin')
        if (platform === 'admin') {
          const supervisor = await sql`
            SELECT login_id as id, name as full_name, email, password as password_hash FROM supervisors WHERE email = ${normalized_id.toLowerCase()}
          `;
          
          if (supervisor.length > 0 && supervisor[0].password_hash === hashPassword(password)) {
            return {
              id: supervisor[0].id,
              name: supervisor[0].full_name,
              email: supervisor[0].email,
              role: 'supervisor', // defaulting to supervisor since role column was removed
              platform: 'admin'
            };
          }
          return null;
        }

        // 2. Handle Student Auth (SAAIO, DIP, WRP)
        const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
        
        try {
          // Dynamic table selection in postgres-js requires specific identifier formatting
          const users = await sql`
            SELECT ${sql(platform === 'saaio' ? 'student_id' : 'login_id')} as login_id, name as full_name, password as password_hash, email 
            FROM ${sql(table)} 
            WHERE ${sql(platform === 'saaio' ? 'student_id' : 'login_id')} = ${normalized_id}
          `;

          if (users.length > 0 && users[0].password_hash === hashPassword(password.trim())) {
            return {
              id: users[0].login_id,
              name: users[0].full_name,
              email: users[0].email,
              loginId: users[0].login_id,
              platform: platform
            };
          }
        } catch (error) {
          console.error('[AUTH_QUERY_FAILED]', error);
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.platform = (user as any).platform;
        token.loginId = (user as any).loginId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).platform = token.platform;
        (session.user as any).loginId = token.loginId;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
