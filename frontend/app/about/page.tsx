export default function AboutPage() {
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-deep-indigo mb-12 text-center">About Us</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-heading text-deep-indigo mb-6">Welcome to Morpankh Saree</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Welcome to Morpankh Saree, your premier destination for premium Indian sarees. We are dedicated to bringing you the finest collection of traditional and contemporary sarees, crafted with attention to detail and quality.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our journey began with a passion for preserving the rich heritage of Indian textiles while embracing modern elegance. Each saree in our collection is carefully curated to represent the perfect blend of timeless tradition and contemporary style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-heading text-deep-indigo mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide our customers with authentic, high-quality sarees that celebrate Indian craftsmanship and culture. We strive to make every woman feel elegant and confident in our beautiful creations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-heading text-deep-indigo mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the most trusted name in premium Indian sarees, known for our exceptional quality, authentic designs, and outstanding customer service.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h3 className="text-2xl font-heading text-deep-indigo mb-6">Why Choose Us?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Premium Quality</h4>
                  <p className="text-gray-600 text-sm">We source only the finest fabrics and materials for our sarees.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Authentic Designs</h4>
                  <p className="text-gray-600 text-sm">Traditional patterns and designs passed down through generations.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Expert Craftsmanship</h4>
                  <p className="text-gray-600 text-sm">Handpicked by skilled artisans with years of experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Customer Satisfaction</h4>
                  <p className="text-gray-600 text-sm">Your happiness is our priority. We ensure quality service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

