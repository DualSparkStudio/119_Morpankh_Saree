'use client';

import { ReactNode, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function Providers({ children }: { children: ReactNode }) {
  const { _hasHydrated, user, token, setUser, setToken } = useStore();

  // Validate token and user state after store hydration
  useEffect(() => {
    if (!_hasHydrated) return;

    // If we have a token but no user, or user but no token - clear invalid state
    if ((token && !user) || (user && !token)) {
      console.warn('Inconsistent auth state detected - clearing');
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
      }
    }

    // If we have a user but it's missing required fields, clear it
    if (user && (!user.id || !user.role)) {
      console.warn('Invalid user object detected - clearing');
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
      }
    }
  }, [_hasHydrated, user, token, setUser, setToken]);

  return <>{children}</>;
}

