import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidEmail, isValidPassword } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RegisterForm as RegisterFormType } from '@/types';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormType>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormType>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormType> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        fetch('https://allegoriclion.app.n8n.cloud/webhook/on-signup/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        }).catch(() => {}); // Fire and forget
        console.log('N8N webhook sent');

        router.push('/dashboard');
      } else {
        setSubmitError(result.error || 'Failed to create account.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormType, value: string) => {
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
            Create your account
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
          placeholder="Create a password"
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
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
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 