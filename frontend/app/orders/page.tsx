'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    router.push('/login?redirect=/orders');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold mb-8">My Orders</h1>
      <p>Redirecting to login...</p>
    </div>
  );
}

