import { Link } from 'react-router-dom'
import { User, Heart, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const Navbar = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const { getCartCount, getWishlistCount } = useApp()

  return (
    <nav className="bg-soft-cream border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-heading text-xl sm:text-2xl text-deep-indigo font-bold">
            Morpankh Saree
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-royal-blue transition-colors">
              Home
            </Link>
            
            {/* Categories Dropdown - Desktop */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-gray-700 hover:text-royal-blue transition-colors"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 pt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link 
                    to="/products?category=silk" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Silk
                  </Link>
                  <Link 
                    to="/products?category=cotton" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Cotton
                  </Link>
                  <Link 
                    to="/products?category=designer" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Designer
                  </Link>
                  <Link 
                    to="/products?category=printed" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Printed
                  </Link>
                  <Link 
                    to="/products?category=dress" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Dress
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-royal-blue transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-royal-blue transition-colors">
              Contact
            </Link>
            <Link to="/policy" className="text-gray-700 hover:text-royal-blue transition-colors">
              Policy
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/profile" 
              className="p-2 text-gray-700 hover:text-royal-blue transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link 
              to="/wishlist" 
              className="p-2 text-gray-700 hover:text-royal-blue transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {getWishlistCount() > 0 && (
                <span className="absolute top-0 right-0 bg-sale-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="p-2 text-gray-700 hover:text-royal-blue transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-sale-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-royal-blue transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-royal-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Categories Dropdown */}
              <div>
                <button
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-royal-blue transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <Link 
                      to="/products?category=silk" 
                      className="block text-gray-600 hover:text-royal-blue"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setMobileCategoriesOpen(false)
                      }}
                    >
                      Silk
                    </Link>
                    <Link 
                      to="/products?category=cotton" 
                      className="block text-gray-600 hover:text-royal-blue"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setMobileCategoriesOpen(false)
                      }}
                    >
                      Cotton
                    </Link>
                    <Link 
                      to="/products?category=designer" 
                      className="block text-gray-600 hover:text-royal-blue"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setMobileCategoriesOpen(false)
                      }}
                    >
                      Designer
                    </Link>
                    <Link 
                      to="/products?category=printed" 
                      className="block text-gray-600 hover:text-royal-blue"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setMobileCategoriesOpen(false)
                      }}
                    >
                      Printed
                    </Link>
                    <Link 
                      to="/products?category=dress" 
                      className="block text-gray-600 hover:text-royal-blue"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setMobileCategoriesOpen(false)
                      }}
                    >
                      Dress
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                to="/about" 
                className="text-gray-700 hover:text-royal-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-royal-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/policy" 
                className="text-gray-700 hover:text-royal-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Policy
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

