import { Heart, Eye, ShoppingCart } from 'lucide-react'

const PremiumPatterns = () => {
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Premium Saree ${i + 1}`,
    price: (2999 + i * 500).toLocaleString(),
    image: `/images/products/product-${i + 1}.jpg`,
  }))

  return (
    <section className="py-12 bg-soft-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">
          Premium Patterns
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Hide image and show fallback
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent && !parent.querySelector('.image-fallback')) {
                      const fallback = document.createElement('div')
                      fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center text-white text-center p-4'
                      fallback.innerHTML = `<div><div class="text-2xl font-heading mb-2">${product.name}</div><div class="text-sm opacity-90">Image Coming Soon</div></div>`
                      parent.appendChild(fallback)
                    }
                  }}
                />
                {/* Hover UI */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-lg font-bold text-deep-indigo">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PremiumPatterns

