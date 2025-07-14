import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/supabase/client';
import { createProfile } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await signUp(email, password);

    if (error) {
      return NextResponse.json(
        { error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) },
        { status: 400 }
      );
    }

    if (data && data.user) {
      // Create profile for the new user
      // Ensure email and updated_at are strings
      const userForProfile = { ...data.user, email: data.user.email || '', updated_at: data.user.updated_at || '' };
      const profile = await createProfile(userForProfile);
      
      if (!profile) {
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        user: data.user,
        profile,
      });
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 