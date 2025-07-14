import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Customer management functions
export const findCustomerByEmail = async (email: string) => {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });
    
    if (customers.data.length > 0) {
      return { customer: customers.data[0], error: null };
    }
    
    return { customer: null, error: null };
  } catch (error) {
    console.error('Error finding Stripe customer by email:', error);
    return { customer: null, error };
  }
};

export const createCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'mini-saas-platform',
      },
    });
    return { customer, error: null };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return { customer: null, error };
  }
};

export const getCustomer = async (customerId: string) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return { customer, error: null };
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    return { customer: null, error };
  }
};

export const updateCustomer = async (
  customerId: string,
  updates: Stripe.CustomerUpdateParams
) => {
  try {
    const customer = await stripe.customers.update(customerId, updates);
    return { customer, error: null };
  } catch (error) {
    console.error('Error updating Stripe customer:', error);
    return { customer: null, error };
  }
};

// Payment method management
export const createPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
) => {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error creating payment method:', error);
    return { success: false, error };
  }
};

export const getPaymentMethods = async (customerId: string) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return { paymentMethods: paymentMethods.data, error: null };
  } catch (error) {
    console.error('Error retrieving payment methods:', error);
    return { paymentMethods: [], error };
  }
};

export const deletePaymentMethod = async (paymentMethodId: string) => {
  try {
    await stripe.paymentMethods.detach(paymentMethodId);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return { success: false, error };
  }
};

// Subscription management
export const createSubscription = async (
  customerId: string,
  priceId: string,
  paymentMethodId?: string
) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
    });
    return { subscription, error: null };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return { subscription: null, error };
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return { subscription, error: null };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { subscription: null, error };
  }
};

// Webhook handling
export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string
) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
};

// Utility functions
export const formatStripeError = (error: any): string => {
  if (error.type === 'StripeCardError') {
    return error.message;
  } else if (error.type === 'StripeInvalidRequestError') {
    return 'Invalid request to Stripe.';
  } else if (error.type === 'StripeAPIError') {
    return 'An error occurred with Stripe\'s API.';
  } else if (error.type === 'StripeConnectionError') {
    return 'Some kind of error occurred during the HTTPS communication.';
  } else if (error.type === 'StripeAuthenticationError') {
    return 'You probably used an incorrect API key.';
  } else {
    return 'An unknown error occurred.';
  }
};

// Price IDs for different subscription tiers
export const PRICE_IDS = {
  BASIC: 'price_basic_monthly',
  PRO: 'price_pro_monthly',
  ENTERPRISE: 'price_enterprise_monthly',
} as const;

// Test card numbers for development
export const TEST_CARDS = {
  VISA: '4242424242424242',
  MASTERCARD: '5555555555554444',
  AMEX: '378282246310005',
  DISCOVER: '6011111111111117',
} as const;