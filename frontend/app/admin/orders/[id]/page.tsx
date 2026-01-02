'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { getImageUrl } from '@/lib/utils/imageHelper';

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
  color?: {
    id: string;
    color: string;
    colorCode?: string;
  } | null;
  selectedColor?: string;
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
  billingAddress?: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  user?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  payments?: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: string;
  }>;
  coupon?: {
    code: string;
    description?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await adminApi.getOrder(orderId);
      setOrder(orderData);
    } catch (err: any) {
      console.error('Error loading order:', err);
      setError(err?.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    
    try {
      setUpdating(true);
      await adminApi.updateOrderStatus(order.id, newStatus);
      await loadOrder(); // Reload order to get updated data
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#312e81] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-heading text-[#312e81] mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 bg-[#312e81] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#312e81] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="font-heading text-4xl text-[#312e81] mb-2">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
            {formatStatus(order.status)}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.paymentStatus)}`}>
            Payment: {formatStatus(order.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading text-[#312e81] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const imageUrl = item.product.images && item.product.images.length > 0 
                  ? getImageUrl(item.product.images[0]) 
                  : '';
                
                return (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized={imageUrl.includes('drive.google.com') || imageUrl.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        target="_blank"
                        className="text-lg font-semibold text-[#312e81] hover:text-[#1e3a8a] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      {item.selectedColor && (
                        <p className="text-sm text-gray-600 mt-1">
                          Color: <span className="font-medium">{item.selectedColor}</span>
                        </p>
                      )}
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
                      <p className="text-lg font-semibold text-[#312e81]">
                        ₹{item.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading text-[#312e81] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status Update */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading text-[#312e81] mb-4">Update Status</h2>
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#312e81] focus:border-transparent disabled:opacity-50"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {updating && (
              <p className="text-sm text-gray-500 mt-2">Updating...</p>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading text-[#312e81] mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Name:</span>{' '}
                {order.user?.name || order.guestName || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span>{' '}
                {order.user?.email || order.guestEmail || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Phone:</span>{' '}
                {order.user?.phone || order.guestPhone || 'N/A'}
              </p>
              {order.user && (
                <p className="text-xs text-gray-500 mt-2">Registered Customer</p>
              )}
              {!order.user && (
                <p className="text-xs text-gray-500 mt-2">Guest Customer</p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          {order.payments && order.payments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-heading text-[#312e81] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <div className="space-y-3">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {payment.method === 'RAZORPAY' ? 'Razorpay' : payment.method}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(payment.status)}`}>
                        {formatStatus(payment.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">₹{payment.amount.toLocaleString()}</p>
                    {payment.razorpayPaymentId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Payment ID: {payment.razorpayPaymentId}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading text-[#312e81] mb-4">Order Summary</h2>
            <div className="space-y-3">
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
              {order.coupon && (
                <div className="text-xs text-gray-500">
                  Coupon: {order.coupon.code}
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
              <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-[#312e81]">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

