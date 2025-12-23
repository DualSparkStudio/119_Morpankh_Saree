'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
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
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: stats.todayRevenue,
      changeLabel: 'Today',
      icon: DollarSign,
      color: 'bg-[#d4af37]',
      isRevenue: true,
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
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change !== undefined && stat.change > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      +{stat.isRevenue ? `₹${stat.change.toLocaleString()}` : stat.change}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#312e81]">{stat.value}</p>
              {stat.changeLabel && (
                <p className="text-xs text-gray-500 mt-1">{stat.changeLabel}: {stat.change}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-heading text-xl text-[#312e81] mb-4">Recent Orders</h2>
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent orders</p>
          </div>
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

