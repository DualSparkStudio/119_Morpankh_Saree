'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
  user: {
    name?: string;
    email?: string;
  } | null;
  guestName?: string;
  guestEmail?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
    loadRecentOrders();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await adminApi.getOrders({ page: 1, limit: 3 });
      setRecentOrders(response.orders);
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312e81]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: stats.todayOrders,
      changeLabel: 'Today',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: '/admin/orders',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-green-500',
      href: '/admin/products',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: stats.todayRevenue,
      changeLabel: 'Today',
      icon: DollarSign,
      color: 'bg-[#d4af37]',
      isRevenue: true,
      href: '/admin/orders',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-[#312e81] mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const CardContent = (
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change !== undefined && stat.change > 0 && (
                  <div className="flex items-center gap-1 text-green-600 flex-shrink-0">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      +{stat.isRevenue ? `₹${stat.change.toLocaleString()}` : stat.change}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-[#312e81]">{stat.value}</p>
                {stat.changeLabel && (
                  <p className="text-xs text-gray-500 mt-1">{stat.changeLabel}: {stat.change}</p>
                )}
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={index} href={stat.href} className="h-full">
              {CardContent}
            </Link>
          ) : (
            <div key={index} className="h-full">{CardContent}</div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl text-[#312e81]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#1e3a8a] hover:text-[#312e81]">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'CONFIRMED' || order.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'PROCESSING' || order.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || order.guestName || 'Guest Customer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#312e81]">₹{order.total.toLocaleString()}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-heading text-xl text-[#312e81] mb-4">Low Stock Alert</h2>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>All products are well stocked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

