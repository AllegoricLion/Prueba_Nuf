'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getProfile, signOut } from '@/lib/supabase';
import { Profile, User } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PaymentMethods from '@/components/payments/PaymentMethods';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customer, setCustomer] = useState<any>(null);
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
      
      if (userError || !user) {
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
      setProfile(profileData);

      // Get Stripe customer if exists
      if (profileData?.stripe_customer_id) {
        // This part of the code was removed as per the edit hint.
        // If you need to fetch the customer from the frontend, you'll need to call an API route.
        // For now, we'll set customer to null or handle it appropriately.
        // setCustomer(customerData); 
      }
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and payment methods
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card title="Profile Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Member since
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(user.created_at)}
                </p>
              </div>

              {profile?.stripe_customer_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stripe Customer ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {profile.stripe_customer_id}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Information */}
          {customer && (
            <Card title="Payment Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {customer.id}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer.email}
                  </p>
                </div>

                {customer.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {customer.name}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(customer.created)}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Payment Methods */}
        {profile?.stripe_customer_id && (
          <div className="mt-8">
            <PaymentMethods 
              customerId={profile.stripe_customer_id}
              onUpdate={loadUserData}
            />
          </div>
        )}

        {/* Add Payment Method */}
        {!profile?.stripe_customer_id && (
          <div className="mt-8">
            <Card title="Add Payment Method">
              <p className="text-gray-600 mb-4">
                You haven't added any payment methods yet. 
                Add a payment method to get started.
              </p>
              <Button onClick={() => router.push('/dashboard/payments')}>
                Add Payment Method
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 