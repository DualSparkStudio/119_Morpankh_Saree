'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e3a8a] text-white mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Description - Left Section */}
          <div className="lg:col-span-1">
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Premium quality sarees with elegant designs. Experience luxury in every thread.
            </p>
          </div>

          {/* About Us & Support Links - Second Section */}
          <div>
            <ul className="space-y-3 text-sm md:text-base">
              <li>
                <Link 
                  href="/about" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Order & Policy Links - Third Section */}
          <div>
            <ul className="space-y-3 text-sm md:text-base">
              <li>
                <Link 
                  href="/orders" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-white/90 hover:text-white transition-colors inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Icons - Right Section */}
          <div className="flex items-start">
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 stroke-2" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 stroke-2" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6 stroke-2" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6 stroke-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/20 mt-10 md:mt-12 pt-6 md:pt-8">
          {/* Copyright */}
          <div className="text-center text-sm md:text-base text-white/80">
            <p>&copy; {currentYear} Morpankh Saree. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

