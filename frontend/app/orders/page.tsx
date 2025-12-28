'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login?redirect=/orders');
    } else {
      setLoading(false);
    }
  }, [token, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold mb-8 text-deep-indigo">My Orders</h1>
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mock orders data - in real implementation, fetch from API
  const orders: any[] = [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">My Orders</h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-heading text-gray-700 mb-2">No Orders Yet</h2>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <Link
                href="/products"
                className="inline-block bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">My Orders</h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-heading text-deep-indigo">Order #{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-xl font-bold text-deep-indigo">₹{order.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-royal-blue hover:text-deep-indigo font-medium"
                  >
                    View Details
                  </Link>
                  {order.status === 'delivered' && (
                    <button className="text-royal-blue hover:text-deep-indigo font-medium">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
