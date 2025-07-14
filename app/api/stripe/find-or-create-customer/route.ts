import { NextRequest, NextResponse } from 'next/server';
import { findCustomerByEmail, createCustomer } from '@/lib/stripe/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    // First, try to find existing customer by email
    const { customer: existingCustomer, error: findError } = await findCustomerByEmail(email);
    
    if (findError) {
      console.error('Error finding customer:', findError);
      return NextResponse.json({ error: 'Failed to search for existing customer' }, { status: 500 });
    }
    
    // If customer exists, return it
    if (existingCustomer) {
      console.log('Found existing customer:', existingCustomer.id);
      return NextResponse.json({ customer: existingCustomer, created: false });
    }
    
    // If no customer exists, create a new one
    const { customer: newCustomer, error: createError } = await createCustomer(email);
    
    if (createError || !newCustomer) {
      console.error('Error creating customer:', createError);
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
    
    console.log('Created new customer:', newCustomer.id);
    return NextResponse.json({ customer: newCustomer, created: true });
    
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
