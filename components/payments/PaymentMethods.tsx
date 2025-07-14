import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface PaymentMethodsProps {
  customerId: string;
  onUpdate?: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  customerId,
  onUpdate,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadPaymentMethods();
  }, [customerId]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      // En lugar de llamar a getPaymentMethods directamente, se llamará a una API route.
      // Esto es necesario porque getPaymentMethods es una función del servidor.
      const response = await fetch(`/api/stripe/payment-methods?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { paymentMethods: PaymentMethod[], error?: string } = await response.json();
      
      if (data.error) {
        console.log('data.error', data.error);
        setError('Failed to load payment methods');
      } else {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      // En lugar de llamar a deletePaymentMethod directamente, se llamará a una API route.
      // Esto es necesario porque deletePaymentMethod es una función del servidor.
      const response = await fetch(`/api/stripe/payment-methods?paymentMethodId=${paymentMethodId}&userId=${customerId}`, {
        method: 'DELETE',
      });
      const data: { success: boolean; error?: string } = await response.json();
      
      if (data.success) {
        setPaymentMethods(prev => 
          prev.filter(pm => pm.id !== paymentMethodId)
        );
        onUpdate?.();
      } else {
        setError('Failed to delete payment method');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const getCardIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    switch (brandLower) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  if (loading) {
    return (
      <Card title="Payment Methods">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Payment Methods">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No payment methods found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Add a payment method to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getCardIcon(paymentMethod.card?.brand || 'card')}
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    {paymentMethod.card?.brand?.toUpperCase()} •••• {paymentMethod.card?.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {paymentMethod.card?.exp_month}/{paymentMethod.card?.exp_year}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PaymentMethods; 