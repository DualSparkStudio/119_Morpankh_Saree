'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useStore } from '@/lib/store';

function LoginForm() {
  console.log('🔵 LoginForm component rendering...');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = searchParams?.get('redirect') || '/';
  
  console.log('🔵 LoginForm - redirect:', redirect);
  console.log('🔵 LoginForm - searchParams available:', !!searchParams);

  useEffect(() => {
    console.log('🔵 LoginForm useEffect running...');
    console.log('🔵 LoginForm - window available:', typeof window !== 'undefined');
    
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('🔵 LoginForm - token exists:', !!token);
      if (token) {
        console.log('🔵 LoginForm - redirecting to:', redirect);
        router.push(redirect);
      }
    }
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
      });

      // Store tokens and user
      setToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      setUser(response.user);

      // Redirect
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  console.log('🔵 LoginForm - rendering JSX, email:', email, 'loading:', loading);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
          DEBUG: LoginForm rendered | Email: {email || 'empty'} | Loading: {loading ? 'yes' : 'no'}
        </div>
        <h1 className="text-4xl font-heading font-bold mb-2 text-[#312e81]">Login</h1>
        <p className="text-gray-600 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#312e81] focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#312e81] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#312e81] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#312e81] hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  console.log('🟢 LoginPage component rendering (root)...');
  
  if (typeof window !== 'undefined') {
    console.log('🟢 LoginPage - window available, client-side rendering');
  } else {
    console.log('🟢 LoginPage - server-side rendering');
  }
  
  return (
    <>
      <div style={{ background: '#e0f0ff', padding: '10px', margin: '10px', fontSize: '12px', border: '2px solid blue' }}>
        DEBUG: LoginPage root component rendered
      </div>
      <Suspense 
        fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto">
              <div style={{ background: '#fff0e0', padding: '10px', marginBottom: '10px' }}>
                DEBUG: Suspense fallback showing (waiting for searchParams)
              </div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312e81] mx-auto"></div>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </>
  );
}
