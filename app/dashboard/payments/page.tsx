'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';
import { getCurrentUser, getProfile } from '@/lib/supabase';
import { User, Profile } from '@/types';
import PaymentForm from '@/components/payments/PaymentForm';
import Button from '@/components/ui/Button';

export default function PaymentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { user, error: userError } = await getCurrentUser();
      console.log('user', user);
      // console.log('userError', userError);
      
      if (userError || !user) {
        console.log('userError', userError);
        router.push('/login');
        return;
      }

      // Map user to local User type to ensure email and created_at are strings
      const mappedUser = {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || '',
      };
      setUser(mappedUser);

      // Get user profile
      const profileData = await getProfile(user.id);
      console.log('profileData', profileData);
      setProfile(profileData);
    } catch (err) {
      console.log('err', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh user data to get updated profile
    loadUserData();
    router.push('/dashboard');
  };

  const handlePaymentError = (error: string) => {
    console.log('error', error);
    setError(error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stripePromise = getStripe();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">Mini SaaS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-2">
            Add and manage your payment methods
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <Elements stripe={stripePromise}>
            <PaymentForm
              userId={user.id}
              email={user.email}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
} 