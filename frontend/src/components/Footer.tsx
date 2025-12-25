import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Share2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-deep-indigo text-soft-cream mt-20">
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
                <Link to="/about" className="text-gray-300 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-gold transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-gold transition-colors">
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
                <Link to="/orders" className="text-gray-300 hover:text-gold transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-gray-300 hover:text-gold transition-colors">
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
                href="#"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="Pinterest"
              >
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Morpankh Saree. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

