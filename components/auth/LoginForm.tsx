import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LoginForm as LoginFormType } from '@/types';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormType>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormType>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormType> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error && typeof error === 'object' && 'message' in error) {
        setSubmitError((error as { message: string }).message);
      } else if (data && data.user) {
        // Trigger N8N webhook for welcome email
        await fetch('/api/webhooks/n8n-welcome', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: data.user.id,
            email: data.user.email,
            timestamp: new Date().toISOString(),
          }),
        });

        router.push('/dashboard');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 