import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }
  try {
    const customer = await stripe.customers.create({ email });
    console.log('created customer', customer);
    return NextResponse.json({ customer });
  } catch (error: any) {
    console.log('Stripe error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 