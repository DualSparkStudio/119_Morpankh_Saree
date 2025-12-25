import { Link } from 'react-router-dom'

const CategorySection = () => {
  const categories = [
    { id: 1, name: 'Silk', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Cotton', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Designer', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Printed', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Dress', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Traditional', image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Modern', image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Bridal', image: 'https://via.placeholder.com/150' },
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
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

