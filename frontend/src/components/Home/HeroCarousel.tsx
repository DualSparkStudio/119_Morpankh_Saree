import { useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      id: 1,
      image: '/images/banners/banner-1.jpg',
      placeholderImage: 'https://images.unsplash.com/photo-1570000000001?w=1920&h=700&fit=crop&q=80',
      title: 'Premium Indian Sarees',
      subtitle: 'Discover elegance in every thread',
      accent: '✨ Handpicked for You'
    },
    {
      id: 2,
      image: '/images/banners/banner-2.jpg',
      placeholderImage: 'https://images.unsplash.com/photo-1570000000002?w=1920&h=700&fit=crop&q=80',
      title: 'Traditional Collection',
      subtitle: 'Timeless beauty and craftsmanship',
      accent: '🌸 Heritage & Grace'
    },
    {
      id: 3,
      image: '/images/banners/banner-3.jpg',
      placeholderImage: 'https://images.unsplash.com/photo-1570000000003?w=1920&h=700&fit=crop&q=80',
      title: 'Designer Sarees',
      subtitle: 'Modern elegance meets tradition',
      accent: '💎 Exquisite Designs'
    },
    {
      id: 4,
      image: '/images/banners/banner-4.jpg',
      placeholderImage: 'https://images.unsplash.com/photo-1570000000004?w=1920&h=700&fit=crop&q=80',
      title: 'Luxury Fabrics',
      subtitle: 'Silk, Cotton, and more',
      accent: '🦋 Premium Quality'
    },
    {
      id: 5,
      image: '/images/banners/banner-5.jpg',
      placeholderImage: 'https://images.unsplash.com/photo-1570000000005?w=1920&h=700&fit=crop&q=80',
      title: 'Special Occasions',
      subtitle: 'Perfect for every celebration',
      accent: '🎀 Celebrate in Style'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className="relative h-[650px] md:h-[800px] lg:h-[900px] overflow-hidden">
      <div className="relative h-full">
        {/* Banner Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover scale-105 transition-transform duration-1000"
                onError={(e) => {
                  // Fallback to placeholder image
                  const target = e.target as HTMLImageElement
                  if (target.src !== slide.placeholderImage) {
                    target.src = slide.placeholderImage
                  }
                }}
              />
              {/* Elegant gradient overlay - soft pink to deep rose */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/70 via-pink-800/60 to-purple-900/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Decorative elements */}
              <div className="absolute top-20 right-10 w-32 h-32 bg-rose-300/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-300/10 rounded-full blur-3xl"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                  <div className="text-white max-w-3xl">
                    {/* Accent text */}
                    {slide.accent && (
                      <div className="flex items-center gap-2 mb-4 opacity-90">
                        <Star className="w-5 h-5 text-rose-200 animate-pulse fill-rose-200" />
                        <span className="font-script text-xl md:text-2xl text-rose-100 tracking-wide">
                          {slide.accent}
                        </span>
                      </div>
                    )}
                    
                    {/* Main title with elegant styling */}
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light mb-6 leading-[1.1] tracking-tight">
                      <span className="block text-white drop-shadow-2xl">
                        {slide.title.split(' ').slice(0, -1).join(' ')}
                      </span>
                      <span className="block text-rose-100 font-medium italic mt-2">
                        {slide.title.split(' ').slice(-1)[0]}
                      </span>
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-lg md:text-2xl lg:text-3xl text-rose-50 mb-8 font-light tracking-wide max-w-xl leading-relaxed">
                      {slide.subtitle}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                      <Link
                        to="/products"
                        className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-2xl hover:shadow-rose-500/50 hover:scale-105 transform"
                      >
                        <span>Shop Collection</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/categories"
                        className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 transform"
                      >
                        Explore Categories
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Elegant Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 hover:border-white/50 text-white p-4 rounded-full shadow-xl transition-all duration-300 z-10 hover:scale-110 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 hover:border-white/50 text-white p-4 rounded-full shadow-xl transition-all duration-300 z-10 hover:scale-110 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Elegant Dots Indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-10 h-3 shadow-lg shadow-rose-500/50' 
                  : 'bg-white/40 hover:bg-white/60 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-soft-cream to-transparent pointer-events-none"></div>
    </section>
  )
}

export default HeroCarousel
