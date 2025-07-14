import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

export async function POST(req: NextRequest) {
  const { customerId, paymentMethodId } = await req.json();
  if (!customerId || !paymentMethodId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  try {
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    // Opcional: establecer como método de pago predeterminado
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 