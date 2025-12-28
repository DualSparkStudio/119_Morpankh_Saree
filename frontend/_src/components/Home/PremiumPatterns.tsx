import { Heart, Eye, ShoppingCart, Star, Percent } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const PremiumPatterns = () => {
  const { toggleWishlist, isInWishlist, addToCart } = useApp()
  // Images from images2 folder
  const images = [
    '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM (1).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM (1).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (1).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (2).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM.jpeg',
  ]

  const products = Array.from({ length: 8 }, (_, i) => {
    const name = `Premium Saree ${i + 1}`
    const currentPrice = 2999 + i * 500
    const originalPrice = Math.round(currentPrice * 1.5)
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    return {
      id: i + 1,
      name,
      price: currentPrice.toLocaleString(),
      originalPrice: originalPrice.toLocaleString(),
      discount,
      rating: 4.5 + (i % 3) * 0.2,
      reviews: Math.floor(Math.random() * 500) + 100,
      image: images[i] || `/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg`,
      placeholderImage: `https://via.placeholder.com/300x400/312e81/ffffff?text=${encodeURIComponent(name)}`,
    }
  })

  const handleWishlistToggle = (e: React.MouseEvent, productId: string | number) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(productId)
  }

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      productId: product.id,
      name: product.name,
      price: parseInt(product.price.replace(/,/g, '')),
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-soft-cream">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-deep-indigo mb-3">
            Premium Patterns
          </h2>
          <p className="text-gray-600 text-lg font-light">Exquisite designs for the modern woman</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
          {products.map((product) => {
            const inWishlist = isInWishlist(product.id)
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-deep-indigo/30 relative"
              >
                {/* Image Container */}
                <Link to={`/product/${product.id}`} className="block relative">
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== product.placeholderImage) {
                          target.src = product.placeholderImage
                        }
                      }}
                    />
                    
                    {/* Discount Badge - Top Left */}
                    <div className="absolute top-3 left-3 bg-sale-red text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                      <Percent className="w-3 h-3" />
                      <span>{product.discount}% OFF</span>
                    </div>
                    
                    {/* Wishlist Button - Top Right */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product.id)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-lg ${
                        inWishlist 
                          ? 'bg-sale-red text-white' 
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* Quick Actions on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-white text-deep-indigo px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-deep-indigo hover:text-white transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </Link>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-sale-red text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-sale-red-light transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </Link>
                
                {/* Product Info */}
                <div className="p-4 md:p-5 bg-white">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-heading font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-deep-indigo transition-colors text-base md:text-lg leading-tight min-h-[3rem]">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : i < product.rating
                              ? 'text-yellow-400 fill-yellow-400/50'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl md:text-2xl font-bold text-sale-red">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  
                  {/* Add to Cart Button - Always Visible */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-deep-indigo hover:bg-navy-blue text-white py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PremiumPatterns

