'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useStore } from '@/lib/store';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken, user, token } = useStore();
  const hasCheckedAuth = useRef(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const redirect = searchParams?.get('redirect') || '/';

  // Wait for component to mount (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only check auth ONCE after component is mounted and hydrated
  useEffect(() => {
    if (!mounted || hasCheckedAuth.current) return;
    
    // Wait for Zustand persist to fully hydrate from localStorage
    // This prevents redirecting with stale/incomplete data
    const timer = setTimeout(() => {
      hasCheckedAuth.current = true;
      
      // Read current values from the store hook
      // These will be the hydrated values after Zustand loads from localStorage
      const currentUser = user;
      const currentToken = token;
      
      // Only redirect if we have COMPLETE user data in store
      // Must have: user object, token, user.id, and user.role
      // This ensures we don't redirect with just a token but no user data
      const hasCompleteAuth = currentUser && currentToken && currentUser.id && currentUser.role;
      
      if (hasCompleteAuth) {
        router.push(redirect);
      }
    }, 1000); // Wait 1 second to ensure Zustand hydration completes

    return () => clearTimeout(timer);
    // Only run once after mount - don't re-run when user/token change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, router, redirect]);

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
      });

      // Store tokens and user through store (store handles localStorage sync)
      setToken(response.token);
      setUser(response.user);
      // Store refresh token separately (not in Zustand store)
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // Redirect
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-2 text-deep-indigo">Login</h1>
          <p className="text-gray-600 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep-indigo text-white py-3 px-4 rounded-lg font-medium hover:bg-royal-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/contact" className="text-deep-indigo hover:underline font-medium">
                Contact us to create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  
  return (
    <Suspense 
      fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo mx-auto"></div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
