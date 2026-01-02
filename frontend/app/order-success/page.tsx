'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Package, ShoppingBag, MapPin, CreditCard, Calendar, Loader2 } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
  };
  variant?: {
    id: string;
    name: string;
    color?: string;
  } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  payments?: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await ordersApi.getOrder(orderId);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err?.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
      case 'DELIVERED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PROCESSING':
      case 'SHIPPED':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'FAILED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-royal-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-2xl font-heading text-deep-indigo mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center gap-2 bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  View Orders
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 border-2 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-5xl text-deep-indigo mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-heading text-deep-indigo mb-2">
                  Order #{order.orderNumber}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.paymentStatus)}`}>
                  Payment: {formatStatus(order.paymentStatus)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-xl font-heading text-deep-indigo mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-lg font-semibold text-deep-indigo hover:text-royal-blue transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-600 mt-1">
                          Variant: {item.variant.name}
                          {item.variant.color && ` (${item.variant.color})`}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-deep-indigo">
                        ₹{item.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-heading text-deep-indigo mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600 mt-2">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                {order.shippingAddress.country && (
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                )}
              </div>
            </div>

            {/* Payment Information */}
            {order.payments && order.payments.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-heading text-deep-indigo mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  {order.payments.map((payment) => (
                    <div key={payment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {payment.method === 'RAZORPAY' ? 'Razorpay' : payment.method}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-deep-indigo">₹{payment.amount.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(payment.status)}`}>
                            {formatStatus(payment.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div>
              <h3 className="text-xl font-heading text-deep-indigo mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>₹{order.tax.toLocaleString()}</span>
                  </div>
                )}
                {order.shipping > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>₹{order.shipping.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-deep-indigo">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 bg-royal-blue hover:bg-deep-indigo text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              View All Orders
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border-2 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
