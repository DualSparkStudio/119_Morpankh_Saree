import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'

const Wishlist = () => {
  const wishlistItems = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Wishlist Saree ${i + 1}`,
    price: (2999 + i * 500).toLocaleString(),
    image: `/images/products/product-${i + 1}.jpg`,
    placeholderImage: `https://source.unsplash.com/300x400/?saree,indian+traditional+wear,wishlist+${i + 1}`,
  }))

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-heading text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding items you love!</p>
            <Link
              to="/products"
              className="inline-block bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Link to={`/product/${item.id}`}>
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== item.placeholderImage) {
                          target.src = item.placeholderImage
                        }
                      }}
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-deep-indigo">₹{item.price}</p>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist

