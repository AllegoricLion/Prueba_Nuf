import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, stripeCustomerId } = await request.json();
    if (!userId || !stripeCustomerId) {
      return NextResponse.json({ error: 'Missing userId or stripeCustomerId' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    if (error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
} 