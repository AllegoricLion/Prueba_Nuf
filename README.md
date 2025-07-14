# Mini SaaS Platform

A complete mini-SaaS platform built with Next.js, Supabase, Stripe, and N8N. This project demonstrates a full-stack SaaS application with authentication, payment processing, and automated notifications.

## 🚀 Features

- **Authentication**: Complete user registration and login with Supabase Auth
- **User Profiles**: Profile management with Stripe customer integration
- **Payment Processing**: Stripe integration for payment methods and subscriptions
- **Automated Notifications**: N8N workflows for welcome emails and notifications
- **Modern UI**: Responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **API Routes**: RESTful API endpoints for all functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Automation**: N8N
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/AllegoricLion/Prueba_Nufi.git
cd mini-saas-platform
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

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

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Create the `profiles` table in your Supabase database:

```sql
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

### 5. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe dashboard
3. Set up webhook endpoints in your Stripe dashboard:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_method.attached`, `customer.created`, `customer.updated`, `invoice.payment_succeeded`, `invoice.payment_failed`

### 6. Set up N8N (Optional)

1. Install N8N locally or use a cloud instance
2. Create a webhook node with the following configuration:
   - Method: POST
   - Path: `/welcome-email`
   - Add an email node to send welcome emails
3. Get your webhook URL and secret

### 7. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
mini-saas-platform/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── stripe/        # Stripe payment endpoints
│   │   └── webhooks/      # Webhook endpoints
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── payments/         # Payment components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client and functions
│   ├── stripe.ts         # Stripe client and functions
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── .env.example          # Environment variables example
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | Yes |
| `N8N_WEBHOOK_URL` | Your N8N webhook URL | No |
| `N8N_WEBHOOK_SECRET` | Your N8N webhook secret | No |

### Database Schema

The application uses the following database schema:

```sql
-- Users table (managed by Supabase Auth)
-- auth.users

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Deploy to other platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS Amplify**: Connect your repository

## 🔒 Security

- All API routes are protected with proper validation
- Environment variables are used for sensitive data
- Supabase Row Level Security (RLS) is enabled
- Stripe webhooks are verified with signatures
- Input validation is implemented throughout

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (if configured)
npm test
```

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "session": { ... }
}
```

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "profile": { ... }
}
```

### Payment Endpoints

#### POST /api/stripe/create-payment-intent
Create a payment intent for client-side payments.

**Request:**
```json
{
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_xxx"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### Webhook Endpoints

#### POST /api/webhooks/n8n-welcome
Trigger N8N webhook for welcome emails.

**Request:**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Stripe](https://stripe.com/) for payment processing
- [N8N](https://n8n.io/) for workflow automation
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ by the Mini SaaS Platform team 