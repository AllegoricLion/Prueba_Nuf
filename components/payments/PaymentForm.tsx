import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { PaymentForm as PaymentFormType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

interface PaymentFormProps {
  userId: string;
  email: string;
  existingCustomerId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Utilidad para crear un cliente de Stripe vía API route
async function findOrCreateCustomer(email: string) {
  const res = await fetch('/api/stripe/find-or-create-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();

  console.log('findOrCreateCustomer data:', data);
  return { customer: data.customer, error: data.error, created: data.created };
}

async function createPaymentMethod(customerId: string, paymentMethodId: string) {
  const res = await fetch('/api/stripe/attach-payment-method', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, paymentMethodId }),
  });
  const data = await res.json();
  return { error: data.error };
}

// New: API call to update Stripe customer ID
async function updateStripeCustomerId(userId: string, stripeCustomerId: string) {
  const res = await fetch('/api/profile/update-stripe-customer-id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, stripeCustomerId }),
  });
  const data = await res.json();
  return data.success;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  userId,
  email,
  existingCustomerId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found.');
      return;
    }

    setLoading(true);

    try {
      let customer;
      
      // Check if user already has a stripe customer ID
      if (existingCustomerId) {
        // Use existing customer
        customer = { id: existingCustomerId };
        console.log('Using existing customer:', existingCustomerId);
      } else {
        // Find or create Stripe customer
        const { customer: foundCustomer, error: customerError } = await findOrCreateCustomer(email);

        if (customerError || !foundCustomer) {
          throw new Error(customerError?.message || 'Failed to create customer');
        }
        
        customer = foundCustomer;
        console.log('Using customer:', customer.id);
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Attach payment method to customer
      const { error: attachError } = await createPaymentMethod(
        customer.id,
        paymentMethod.id
      );

      if (attachError) {
        throw new Error('Failed to attach payment method to customer');
      }

      // Update user profile with Stripe customer ID via API route (only if not already set)
      if (!existingCustomerId) {
        const success = await updateStripeCustomerId(userId, customer.id);
        
        if (!success) {
          throw new Error('Failed to update user profile');
        }
      }

      // Clear the form
      cardElement.clear();
      
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Card title="Add Payment Method" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !stripe}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Add Payment Method'}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          <p>Your payment information is secure and encrypted.</p>
          <p className="mt-1">
            Test card: 4242 4242 4242 4242
          </p>
        </div>
      </form>
    </Card>
  );
};

export default PaymentForm; 