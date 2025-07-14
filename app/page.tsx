import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">Mini SaaS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              Complete Mini SaaS Platform
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              A fully-featured SaaS platform with authentication, payments, and automated notifications. 
              Built with Next.js, Supabase, Stripe, and N8N.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg">
                  Start your free trial
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to build a SaaS
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete authentication, payment processing, and automation workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication
              </h3>
              <p className="text-gray-600">
                Secure user registration and login with Supabase Auth. 
                Complete profile management and session handling.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Processing
              </h3>
              <p className="text-gray-600">
                Integrated Stripe payments with customer management, 
                subscription handling, and secure payment methods.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Automation
              </h3>
              <p className="text-gray-600">
                N8N workflows for automated welcome emails, 
                notifications, and business process automation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Built with modern technologies
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Leveraging the best tools for a scalable and maintainable application
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">⚛️</div>
              <h3 className="font-semibold text-gray-900">Next.js</h3>
              <p className="text-sm text-gray-600">React framework</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🗄️</div>
              <h3 className="font-semibold text-gray-900">Supabase</h3>
              <p className="text-sm text-gray-600">Backend & Auth</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="font-semibold text-gray-900">Stripe</h3>
              <p className="text-sm text-gray-600">Payments</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔧</div>
              <h3 className="font-semibold text-gray-900">N8N</h3>
              <p className="text-sm text-gray-600">Automation</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of users building their SaaS with our platform
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Start building today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Mini SaaS Platform</h3>
            <p className="text-gray-400">
              A complete SaaS solution built with modern technologies
            </p>
            <div className="mt-8 text-sm text-gray-400">
              <p>&copy; 2024 Mini SaaS Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 