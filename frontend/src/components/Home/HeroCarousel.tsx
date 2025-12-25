import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = Array.from({ length: 5 }, (_, i) => i)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-r from-deep-indigo/80 to-deep-indigo/40">
      <div className="relative h-full">
        {/* Placeholder Images */}
        {slides.map((_, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-5xl md:text-7xl font-heading font-bold mb-4">
                  Banner {index + 1}
                </h2>
                <p className="text-xl md:text-2xl">Placeholder Image</p>
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

