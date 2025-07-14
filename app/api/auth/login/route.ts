import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  console.log('here');
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

    
    // Send POST to N8N webhook with user email
    if (data && data.user && data.user.email) {
      console.log('sending webhook');
      try {
        const webhookRes = await fetch('https://allegoriclion.app.n8n.cloud/webhook-test/on-login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.user.email }),
        });
        console.log('Webhook sent, status:', webhookRes.status);
      } catch (err) {
        console.error('Webhook error:', err);
      }
    }

    console.log('data', data);

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