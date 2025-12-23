'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#312e81] text-[#fffef9] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">Morpankh Saree</h3>
            <p className="text-sm text-gray-300">
              Premium quality sarees with elegant designs. Experience luxury in every thread.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#d4af37] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#d4af37] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#d4af37] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#d4af37] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Morpankh Saree. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

