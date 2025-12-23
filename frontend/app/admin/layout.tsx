'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Inventory,
  Ticket,
  Image as ImageIcon,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/inventory', icon: Inventory, label: 'Inventory' },
    { href: '/admin/customers', icon: Users, label: 'Customers' },
    { href: '/admin/coupons', icon: Ticket, label: 'Coupons' },
    { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#fffef9]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#312e81] text-white">
        <div className="p-6 border-b border-[#1e3a8a]">
          <h1 className="font-heading text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-300 mt-1">Morpankh Saree</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 border-t border-[#1e3a8a]">
            <div className="text-sm text-gray-300 mb-2">{user.name || user.email}</div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors text-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

