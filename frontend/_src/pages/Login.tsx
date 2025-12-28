import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../../lib/api/auth';
import { useStore } from '../../lib/store';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = location.state?.from?.pathname || new URLSearchParams(location.search).get('redirect') || '/';

  console.log('🔵 Login component rendering...');
  console.log('🔵 Login - redirect:', redirect);

  useEffect(() => {
    console.log('🔵 Login useEffect running...');
    
    // Check if already logged in
    const token = localStorage.getItem('token');
    console.log('🔵 Login - token exists:', !!token);
    if (token) {
      console.log('🔵 Login - redirecting to:', redirect);
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔵 Login - submitting form...');

    try {
      const response = await authApi.login({
        email,
        password,
      });

      console.log('🔵 Login - login successful');

      // Store tokens and user
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);

      // Redirect
      navigate(redirect, { replace: true });
    } catch (err: any) {
      console.error('🔵 Login - error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  console.log('🔵 Login - rendering JSX, email:', email, 'loading:', loading);

  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div style={{ background: '#e0f0ff', padding: '10px', margin: '10px', fontSize: '12px', border: '2px solid blue' }}>
        DEBUG: Login component rendered
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
            DEBUG: LoginForm | Email: {email || 'empty'} | Loading: {loading ? 'yes' : 'no'}
          </div>
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
              <Link to="/register" className="text-deep-indigo hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

