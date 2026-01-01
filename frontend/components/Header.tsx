'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { cart, wishlist, user, logout } = useStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cart && cart.length > 0 ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

  const categories = [
    { name: 'Silk', slug: 'silk' },
    { name: 'Cotton', slug: 'cotton' },
    { name: 'Designer', slug: 'designer' },
    { name: 'Printed', slug: 'printed' },
    { name: 'Dress', slug: 'dress' },
    { name: 'Handloom', slug: 'handloom' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    if (categoriesDropdownOpen || userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoriesDropdownOpen, userDropdownOpen]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-[#fffef9] border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-2 md:px-3">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center h-full py-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/Moprpankh-Sarees-Logo.png"
              alt="Morpankh Saree Logo"
              width={240}
              height={80}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Products
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#1e3a8a] transition-colors"
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-[#1e3a8a] hover:text-white transition-colors"
                      onClick={() => setCategoriesDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-2 text-gray-700 hover:text-[#1e3a8a] transition-colors flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#1e3a8a] hover:text-white transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
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
              <Link href="/" className="text-gray-700 hover:text-[#1e3a8a]">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-[#1e3a8a]">
                Products
              </Link>
              <div>
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-[#1e3a8a]"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoriesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className="block text-gray-600 hover:text-[#1e3a8a]"
                        onClick={() => {
                          setCategoriesDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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

