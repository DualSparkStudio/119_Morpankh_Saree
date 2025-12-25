import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      id: 1,
      image: '/images/banners/banner-1.jpg',
      title: 'Premium Indian Sarees',
      subtitle: 'Discover elegance in every thread'
    },
    {
      id: 2,
      image: '/images/banners/banner-2.jpg',
      title: 'Traditional Collection',
      subtitle: 'Timeless beauty and craftsmanship'
    },
    {
      id: 3,
      image: '/images/banners/banner-3.jpg',
      title: 'Designer Sarees',
      subtitle: 'Modern elegance meets tradition'
    },
    {
      id: 4,
      image: '/images/banners/banner-4.jpg',
      title: 'Luxury Fabrics',
      subtitle: 'Silk, Cotton, and more'
    },
    {
      id: 5,
      image: '/images/banners/banner-5.jpg',
      title: 'Special Occasions',
      subtitle: 'Perfect for every celebration'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="relative h-full">
        {/* Banner Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.className += ' bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep-indigo/80 to-deep-indigo/40" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="text-white max-w-2xl">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-100">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-deep-indigo p-3 rounded-full shadow-lg transition-all z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-deep-indigo p-3 rounded-full shadow-lg transition-all z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
