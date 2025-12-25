import { Link } from 'react-router-dom'
import { User, Heart, ShoppingBag, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <nav className="bg-soft-cream border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-heading text-2xl text-deep-indigo font-bold">
            Morpankh Saree
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-royal-blue transition-colors">
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-royal-blue transition-colors">
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link to="/products?category=silk" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Silk
                  </Link>
                  <Link to="/products?category=cotton" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Cotton
                  </Link>
                  <Link to="/products?category=designer" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Designer
                  </Link>
                  <Link to="/products?category=printed" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Printed
                  </Link>
                  <Link to="/products?category=dress" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
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
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-royal-blue transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-royal-blue transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-royal-blue transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

