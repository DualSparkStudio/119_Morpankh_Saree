import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, ShoppingCart, Share2 } from 'lucide-react'

const ProductDetail = () => {
  const { id: _id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)

  const productId = _id ? parseInt(_id) : 1
  const images = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    url: `/images/products/product-${productId}-${i + 1}.jpg`,
  }))

  const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Related Product ${i + 1}`,
    price: (1999 + i * 500).toLocaleString(),
    image: `/images/products/product-${i + 20}.jpg`,
  }))

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Image Gallery */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-royal-blue'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent && !parent.querySelector('.image-fallback')) {
                        const fallback = document.createElement('div')
                        fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-400 text-white text-xs'
                        fallback.textContent = `${index + 1}`
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 order-1 lg:order-2">
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={images[selectedImage].url}
                  alt="Main product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent && !parent.querySelector('.image-fallback')) {
                      const fallback = document.createElement('div')
                      fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 text-white text-center p-8'
                      fallback.innerHTML = '<div><div class="text-3xl font-heading mb-2">Product Image</div><div class="text-sm opacity-90">Image Coming Soon</div></div>'
                      parent.appendChild(fallback)
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-4">
                Premium Designer Saree
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-royal-blue mb-6">
                ₹4,999
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex-1 bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="flex-1 bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Buy Now
              </button>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-700" />
                <span>Wishlist</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
                <span>Share</span>
              </button>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-heading text-deep-indigo mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                This premium designer saree features exquisite craftsmanship and elegant design.
                Made with high-quality materials, it's perfect for special occasions. The intricate
                patterns and beautiful color combinations make it a standout piece in any collection.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600"><strong>Material:</strong> Pure Silk</p>
                <p className="text-gray-600"><strong>Care:</strong> Dry Clean Only</p>
                <p className="text-gray-600"><strong>Color:</strong> Royal Blue with Gold</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-6">
            Related Products
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow min-w-[250px]"
                >
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent && !parent.querySelector('.image-fallback')) {
                          const fallback = document.createElement('div')
                          fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 text-white text-center p-4'
                          fallback.innerHTML = `<div><div class="text-lg font-heading mb-1">${product.name}</div><div class="text-xs opacity-90">Image Coming Soon</div></div>`
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-deep-indigo">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

