import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await signIn(email, password);

    if (error) {
      return NextResponse.json(
        { error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data && data.user,
      session: data && data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 