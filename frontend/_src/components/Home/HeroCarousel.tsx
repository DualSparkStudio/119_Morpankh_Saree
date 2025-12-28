import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const slides = [
    {
      id: 1,
      image: '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg',
      title: 'Premium Indian Sarees',
      subtitle: 'Discover elegance in every thread',
      badge: 'BUY 2 GET 1 FREE',
      discount: 'Up to 70% OFF'
    },
    {
      id: 2,
      image: '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM.jpeg',
      title: 'Traditional Collection',
      subtitle: 'Timeless beauty and craftsmanship',
      badge: 'NEW ARRIVALS',
      discount: 'Limited Edition'
    },
    {
      id: 3,
      image: '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM.jpeg',
      title: 'Designer Sarees',
      subtitle: 'Modern elegance meets tradition',
      badge: 'EXCLUSIVE',
      discount: 'Premium Quality'
    },
    {
      id: 4,
      image: '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM.jpeg',
      title: 'Luxury Fabrics',
      subtitle: 'Silk, Cotton, and more',
      badge: 'BESTSELLER',
      discount: 'Trending Now'
    },
    {
      id: 5,
      image: '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM (1).jpeg',
      title: 'Special Occasions',
      subtitle: 'Perfect for every celebration',
      badge: 'WEDDING SPECIAL',
      discount: 'Elegant Collection'
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
      }, 2500) // Change slide every 2.5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, slides.length])

  // Reset interval when slide changes manually
  const handleSlideChange = (newSlide: number) => {
    setCurrentSlide(newSlide)
    // Reset the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
      }, 2500)
    }
  }

  return (
    <section 
      className="relative h-[600px] md:h-[750px] lg:h-[850px] overflow-hidden bg-gradient-to-br from-deep-indigo via-navy-blue to-deep-indigo"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-full">
        {/* Banner Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
              
              {/* Gradient Overlay - More subtle */}
              <div className="absolute inset-0 bg-gradient-to-r from-deep-indigo/85 via-deep-indigo/75 to-deep-indigo/85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 w-full">
                  <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
                    {/* Left Side - Text Content */}
                    <div className="text-white space-y-6 z-10">
                      {/* Badge */}
                      {slide.badge && (
                        <div className="inline-flex items-center gap-2 bg-sale-red text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
                          <Tag className="w-4 h-4" />
                          <span>{slide.badge}</span>
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {slide.discount && (
                        <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold mb-2 border border-white/30">
                          {slide.discount}
                        </div>
                      )}
                      
                      {/* Main Title */}
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                        <span className="block text-white drop-shadow-lg mb-2">
                          {slide.title}
                        </span>
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-lg leading-relaxed">
                        {slide.subtitle}
                      </p>
                      
                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                          to="/products"
                          className="group inline-flex items-center justify-center gap-2 bg-sale-red hover:bg-sale-red-light text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                        >
                          <span>Shop Now</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/categories"
                          className="inline-flex items-center justify-center gap-2 bg-white text-deep-indigo hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 shadow-xl hover:scale-105 transform"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span>Explore</span>
                        </Link>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <div className="w-2 h-2 bg-sale-red rounded-full"></div>
                          <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <div className="w-2 h-2 bg-sale-red rounded-full"></div>
                          <span>Easy Returns</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <div className="w-2 h-2 bg-sale-red rounded-full"></div>
                          <span>Authentic Products</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Image Showcase (Optional decorative element) */}
                    <div className="hidden md:block relative">
                      <div className="relative w-full aspect-square max-w-md mx-auto">
                        <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 p-4">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover rounded-xl shadow-2xl"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                        {/* Decorative corner accent */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-sale-red/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-deep-indigo/30 rounded-full blur-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - More prominent */}
        <button
          onClick={() => {
            const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
            handleSlideChange(newSlide)
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white hover:bg-sale-red text-deep-indigo hover:text-white p-3 md:p-4 rounded-full shadow-2xl transition-all duration-300 z-20 hover:scale-110 group border-2 border-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => {
            const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1
            handleSlideChange(newSlide)
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white hover:bg-sale-red text-deep-indigo hover:text-white p-3 md:p-4 rounded-full shadow-2xl transition-all duration-300 z-20 hover:scale-110 group border-2 border-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Dots Indicator - Enhanced */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-sale-red w-8 h-3 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative bottom wave with pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-soft-cream via-soft-cream/80 to-transparent pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-deep-indigo/20 to-transparent"></div>
      </div>
    </section>
  )
}

export default HeroCarousel
