'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState } from 'react';

export default function Header() {
  const { cart, wishlist, user } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="bg-[#fffef9] border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-heading text-2xl text-[#312e81] font-bold">
            Morpankh Saree
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#d4af37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#d4af37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href={user ? "/account" : "/login"}
              className="p-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
            <Link href="/products" className="text-gray-700 hover:text-[#1e3a8a]">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-[#1e3a8a]">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#1e3a8a]">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#1e3a8a]">
              Contact
            </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

