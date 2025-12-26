import { Link } from 'react-router-dom'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const TrendingPatterns = () => {
  const { toggleWishlist, isInWishlist, addToCart } = useApp()
  // Images from images2 folder (using the remaining image)
  const images = [
    '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM (1).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM.jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM (1).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM (1).jpeg',
    '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (1).jpeg',
  ]

  const products = Array.from({ length: 8 }, (_, i) => {
    const name = `Trending Saree ${i + 1}`
    return {
      id: i + 1,
      name,
      price: (1999 + i * 400).toLocaleString(),
      image: images[i] || `/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM (1).jpeg`,
      placeholderImage: `https://via.placeholder.com/300x400/312e81/ffffff?text=${encodeURIComponent(name)}`,
    }
  })

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-soft-cream to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-deep-indigo mb-3">
              Trending Patterns
            </h2>
            <p className="text-gray-600 text-lg font-light">What's hot right now</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-deep-indigo hover:bg-navy-blue text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>See more</span>
            <span>→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const inWishlist = isInWishlist(product.id)
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-deep-indigo"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== product.placeholderImage) {
                          target.src = product.placeholderImage
                        }
                      }}
                    />
                    {/* Sale badge */}
                    <div className="absolute top-2 right-2 bg-sale-red text-white px-2 py-1 rounded text-xs font-bold">
                      BUY 2 GET 1 FREE
                    </div>
                    {/* Elegant overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Hover UI */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        className={`bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg ${
                          inWishlist ? 'text-sale-red' : 'text-gray-700'
                        }`}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg text-gray-700"
                        aria-label="View product"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart({
                            productId: product.id,
                            name: product.name,
                            price: parseInt(product.price.replace(/,/g, '')),
                            image: product.image,
                            quantity: 1,
                          })
                        }}
                        className="bg-deep-indigo hover:bg-navy-blue p-3 rounded-full hover:scale-110 transition-all shadow-lg text-white"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
                <div className="p-4 md:p-5">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-heading font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-deep-indigo transition-colors text-base md:text-lg">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <p className="text-lg md:text-xl font-bold text-sale-red">₹{product.price}</p>
                    <p className="text-sm text-gray-400 line-through">₹{(parseInt(product.price.replace(/,/g, '')) * 1.5).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrendingPatterns

