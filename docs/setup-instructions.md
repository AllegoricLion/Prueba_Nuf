# Mini SaaS Platform - Setup Instructions

This document provides detailed step-by-step instructions for setting up the complete mini-SaaS platform.

## 🚀 Quick Setup Commands

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd mini-saas-platform

# 2. Install dependencies
npm install

# 3. Copy environment file
cp env.example .env.local

# 4. Start development server
npm run dev
```

## 📋 Detailed Setup Guide

### Step 1: Environment Configuration

1. **Copy the environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Configure your environment variables in `.env.local`:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe Configuration (Test Mode)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

   # N8N Webhook Configuration
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/welcome-email
   N8N_WEBHOOK_SECRET=your_n8n_webhook_secret

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   ```

### Step 2: Supabase Setup

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Set up the database schema:**
   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     stripe_customer_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);
   ```

3. **Configure authentication:**
   - Go to Authentication > Settings in your Supabase dashboard
   - Configure your site URL and redirect URLs
   - Set up email templates if needed

### Step 3: Stripe Setup

1. **Create a Stripe account:**
   - Go to [stripe.com](https://stripe.com)
   - Create an account and get your API keys

2. **Get your test API keys:**
   - Go to Developers > API keys in your Stripe dashboard
   - Copy your publishable key and secret key (test mode)

3. **Set up webhooks:**
   - Go to Developers > Webhooks in your Stripe dashboard
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_method.attached`, `customer.created`, `customer.updated`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the webhook secret

### Step 4: N8N Setup (Optional)

1. **Install N8N:**
   ```bash
   npm install -g n8n
   n8n start
   ```

2. **Import the workflow:**
   - Open N8N at `http://localhost:5678`
   - Import the workflow from `docs/n8n-workflow-example.json`
   - Configure your email settings

3. **Get your webhook URL:**
   - The webhook URL will be something like: `http://localhost:5678/webhook/welcome-email`
   - For production, use your N8N instance URL

### Step 5: Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to `http://localhost:3000`
   - You should see the landing page

3. **Test the application:**
   - Register a new account
   - Log in and access the dashboard
   - Add a payment method
   - Check that the welcome email is sent

## 🔧 Configuration Details

### Supabase Configuration

- **Project URL**: Found in your Supabase project settings
- **Anon Key**: Public key for client-side operations
- **Service Role Key**: Private key for server-side operations (keep secret)

### Stripe Configuration

- **Publishable Key**: Used in the frontend (starts with `pk_test_`)
- **Secret Key**: Used in the backend (starts with `sk_test_`)
- **Webhook Secret**: Generated when you create a webhook endpoint

### N8N Configuration

- **Webhook URL**: Your N8N instance webhook URL
- **Webhook Secret**: Custom secret for webhook verification

## 🧪 Testing

### Test Cards (Stripe Test Mode)

Use these test card numbers for payment testing:

- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005
- **Discover**: 6011 1111 1111 1117

### Test Scenarios

1. **User Registration:**
   - Register with a new email
   - Verify welcome email is sent
   - Check profile is created in Supabase

2. **User Login:**
   - Login with registered credentials
   - Access dashboard
   - View profile information

3. **Payment Processing:**
   - Add a test payment method
   - Verify customer is created in Stripe
   - Check payment method is saved

4. **Webhook Testing:**
   - Trigger login/registration
   - Verify N8N webhook is called
   - Check email is sent

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Update webhook URLs:**
   - Update Stripe webhook URL to your production domain
   - Update N8N webhook URL if using cloud instance

### Environment Variables for Production

Make sure to update these for production:

```env
NEXTAUTH_URL=https://your-domain.com
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/welcome-email
```

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use different keys for development and production

2. **API Keys:**
   - Keep service role keys secret
   - Use test keys for development
   - Rotate keys regularly

3. **Webhooks:**
   - Verify webhook signatures
   - Use HTTPS for production webhooks
   - Implement proper error handling

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error:**
   - Check your project URL and API keys
   - Verify the database schema is created
   - Check Row Level Security policies

2. **Stripe Payment Error:**
   - Verify API keys are correct
   - Check webhook endpoint is accessible
   - Use test cards for testing

3. **N8N Webhook Error:**
   - Verify webhook URL is correct
   - Check N8N is running and accessible
   - Verify webhook secret matches

4. **Build Errors:**
   - Check all environment variables are set
   - Verify TypeScript types are correct
   - Clear `.next` folder and rebuild

### Debug Commands

```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint

# Clear Next.js cache
rm -rf .next
npm run dev

# Check environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

## 📞 Support

If you encounter issues:

1. Check the [README.md](README.md) for general information
2. Review the [API documentation](README.md#api-documentation)
3. Check the [troubleshooting section](#troubleshooting)
4. Create an issue in the repository

## 🎉 Next Steps

After successful setup:

1. **Customize the UI:**
   - Modify colors in `tailwind.config.js`
   - Update branding in components
   - Add your logo and content

2. **Add Features:**
   - Implement subscription plans
   - Add more payment methods
   - Create additional N8N workflows

3. **Scale:**
   - Set up monitoring and analytics
   - Implement caching strategies
   - Add automated testing

4. **Deploy:**
   - Set up CI/CD pipelines
   - Configure production monitoring
   - Implement backup strategies 