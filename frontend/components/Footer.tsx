'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e3a8a] text-white mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Description - Left Section */}
          <div className="lg:col-span-1">
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Premium quality sarees with elegant designs. Experience luxury in every thread.
            </p>
          </div>

          {/* About Us & Support Links - Second Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">About Us</h3>
            <ul className="space-y-3 text-sm md:text-base list-disc list-inside">
              <li>
                <Link 
                  href="/about" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Order & Policy Links - Third Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Track Order</h3>
            <ul className="space-y-3 text-sm md:text-base list-disc list-inside">
              <li>
                <Link 
                  href="/orders" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Icons - Fourth Section */}
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

          {/* Google Maps - Fifth Section */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">Find Us</h3>
            <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '200px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.225488826108!2d73.93144819999999!3d18.5618115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c10075547f01%3A0x3f3c947c85c0923e!2sMorpankh%20Saree!5e1!3m2!1sen!2sin!4v1767457061823!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/20 mt-10 md:mt-12 pt-6 md:pt-8">
          {/* Copyright */}
          <div className="text-center text-sm md:text-base text-white/80 space-y-2">
            <p>&copy; {currentYear} Morpankh Saree. All rights reserved.</p>
            <p className="text-white/60 text-xs md:text-sm">
              Designed & Developed by{' '}
              <a 
                href="https://dualsparkstudio.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                DualSpark Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

