// User and Profile Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Stripe Types
export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name: string;
    email: string;
  };
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  payment_methods: PaymentMethod[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  name: string;
}

// N8N Webhook Types
export interface WelcomeEmailPayload {
  user_id: string;
  email: string;
  name?: string;
  timestamp: string;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
} 