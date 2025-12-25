import { Link } from 'react-router-dom'

const CategorySection = () => {
  const categories = [
    { id: 1, name: 'Silk', image: '/images/categories/silk.jpg',       placeholderImage: 'https://images.unsplash.com/photo-1570000000001?w=150&h=150&fit=crop&q=80' },
    { id: 2, name: 'Cotton', image: '/images/categories/cotton.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000002?w=150&h=150&fit=crop&q=80' },
    { id: 3, name: 'Designer', image: '/images/categories/designer.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000003?w=150&h=150&fit=crop&q=80' },
    { id: 4, name: 'Printed', image: '/images/categories/printed.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000004?w=150&h=150&fit=crop&q=80' },
    { id: 5, name: 'Dress', image: '/images/categories/dress.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000005?w=150&h=150&fit=crop&q=80' },
    { id: 6, name: 'Traditional', image: '/images/categories/traditional.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000006?w=150&h=150&fit=crop&q=80' },
    { id: 7, name: 'Modern', image: '/images/categories/modern.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000007?w=150&h=150&fit=crop&q=80' },
    { id: 8, name: 'Bridal', image: '/images/categories/bridal.jpg', placeholderImage: 'https://images.unsplash.com/photo-1570000000008?w=150&h=150&fit=crop&q=80' },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-heading text-deep-indigo">Categories</h2>
          <Link to="/products" className="text-royal-blue hover:text-deep-indigo font-medium">
            See more →
          </Link>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center gap-3 min-w-[120px]"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder image
                      const target = e.target as HTMLImageElement
                      if (target.src !== category.placeholderImage) {
                        target.src = category.placeholderImage
                      }
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategorySection
