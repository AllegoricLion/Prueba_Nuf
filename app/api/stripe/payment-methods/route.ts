import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId');

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return NextResponse.json({ paymentMethods: paymentMethods.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();
    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return NextResponse.json({ paymentMethods: paymentMethods.data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentMethodId = searchParams.get('paymentMethodId');
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  if (!paymentMethodId) {
    return NextResponse.json({ error: 'Missing paymentMethodId' }, { status: 400 });
  }

  // remove the payment method from stripe
  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
  console.log('paymentMethod', paymentMethod);

  // update the profile with the new payment method
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ stripe_customer_id: null })
    .eq('id', userId);

  console.log('updateError', updateError);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Payment method removed successfully' });
}