import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

const Cart = () => {
  const cartItems = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: `Cart Saree ${i + 1}`,
    price: (2999 + i * 500),
    quantity: i + 1,
    image: `/images/products/product-${i + 1}.jpg`,
    placeholderImage: `https://source.unsplash.com/300x400/?saree,indian+traditional+wear,cart+${i + 1}`,
  }))

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 200
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-heading text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart!</p>
            <Link
              to="/products"
              className="inline-block bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
                >
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-32 sm:w-32 sm:h-40 bg-gray-100 rounded-lg overflow-hidden">
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
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-gray-800 mb-2 hover:text-royal-blue">{item.name}</h3>
                      </Link>
                      <p className="text-lg font-bold text-deep-indigo">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button className="p-2 hover:bg-gray-100">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                        <button className="p-2 hover:bg-gray-100">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-heading text-deep-indigo mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-deep-indigo">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

