import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// Mock JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

// POST: User login
export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, accept any email/password combination
    // In production, verify against database
    if (email && password.length >= 6) {
      // Create mock user data
      const user: User = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'student',
        createdAt: new Date().toISOString(),
      };

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Store user session in Supabase (optional)
      try {
        await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            email: user.email,
            token: token,
            created_at: new Date().toISOString(),
          });
      } catch (dbError) {
        console.warn('Failed to store session in database:', dbError);
        // Continue anyway - session storage is optional
      }

      return NextResponse.json({
        user,
        token,
        refreshToken: 'refresh_' + token, // Mock refresh token
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}