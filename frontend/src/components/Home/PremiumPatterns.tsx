import { Heart, Eye, ShoppingCart } from 'lucide-react'

const PremiumPatterns = () => {
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
    return {
      id: i + 1,
      name,
      price: (2999 + i * 500).toLocaleString(),
      image: images[i] || `/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg`,
      placeholderImage: `https://via.placeholder.com/300x400/312e81/ffffff?text=${encodeURIComponent(name)}`,
    }
  })

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-soft-cream">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-deep-indigo mb-3">
            Premium Patterns
          </h2>
          <p className="text-gray-600 text-lg font-light">Exquisite designs for the modern woman</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-rose-200"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to placeholder image
                    const target = e.target as HTMLImageElement
                    if (target.src !== product.placeholderImage) {
                      target.src = product.placeholderImage
                    }
                  }}
                />
                {/* Elegant overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Hover UI */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg">
                    <Eye className="w-5 h-5 text-rose-600" />
                  </button>
                  <button className="bg-gradient-to-r from-rose-500 to-pink-600 p-3 rounded-full hover:from-rose-600 hover:to-pink-700 hover:scale-110 transition-all shadow-lg text-white">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-heading font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors text-base md:text-lg">
                  {product.name}
                </h3>
                <p className="text-lg md:text-xl font-bold text-rose-600">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PremiumPatterns

