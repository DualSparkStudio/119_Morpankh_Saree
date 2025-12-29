'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import { bannersApi, Banner } from '@/lib/api/banners';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannersApi.getBanners('HERO');
      setBanners(data.filter(b => b.isActive));
      // If no HERO banners, use default with main hero image
      if (data.length === 0) {
        setBanners([{
          id: 'default',
          image: '/images2/hero sec(main photo).jpg',
          title: 'Premium Indian Sarees',
          description: 'Discover elegance in every thread',
          link: '/products',
          linkText: 'Shop Now',
          position: 'HERO',
          order: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]);
      }
    } catch (error: any) {
      // Silently handle rate limiting (429) errors - fallback is already in place
      if (error?.response?.status !== 429) {
        console.error('Error loading banners:', error);
      }
      // Fallback to default banner with hero section image
      setBanners([{
        id: 'default',
        image: '/images2/hero sec(main photo).jpg',
        title: 'Premium Indian Sarees',
        description: 'Discover elegance in every thread',
        link: '/products',
        linkText: 'Shop Now',
        position: 'HERO',
        order: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string): string => {
    // Use the hero section image as default
    if (!image) return '/images2/hero sec(main photo).jpg';
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const baseUrl = apiUrl.replace('/api', '');
      return `${baseUrl}${image}`;
    }
    return image;
  };

  const slides = banners.length > 0 ? banners.map((banner, index) => ({
    id: banner.id,
    image: getImageUrl(banner.image),
    title: banner.title || 'Premium Indian Sarees',
    subtitle: banner.description || 'Discover elegance in every thread',
    badge: index === 0 ? 'BUY 2 GET 1 FREE' : index === 1 ? 'NEW ARRIVALS' : index === 2 ? 'EXCLUSIVE' : index === 3 ? 'BESTSELLER' : 'WEDDING SPECIAL',
    discount: index === 0 ? 'Up to 70% OFF' : index === 1 ? 'Limited Edition' : index === 2 ? 'Premium Quality' : index === 3 ? 'Trending Now' : 'Elegant Collection',
    link: banner.link || '/products',
    linkText: banner.linkText || 'Shop Now',
  })) : [];

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && slides.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 2500); // Change slide every 2.5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, slides.length]);

  // Reset interval when slide changes manually
  const handleSlideChange = (newSlide: number) => {
    setCurrentSlide(newSlide);
    // Reset the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 2500);
    }
  };

  if (loading) {
    return (
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gradient-to-br from-deep-indigo via-navy-blue to-deep-indigo flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gradient-to-br from-deep-indigo via-navy-blue to-deep-indigo"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-full">
        {/* Decorative Geometric Shapes - Dark Blue/White Theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full opacity-30 blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full opacity-25 blur-sm"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/10 rounded-full opacity-20 blur-sm"></div>
          
          {/* Triangles */}
          <div className="absolute top-1/4 right-1/3 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-white/15 opacity-20 rotate-45"></div>
          <div className="absolute bottom-1/4 left-1/3 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[45px] border-b-white/15 opacity-25 -rotate-12"></div>
          
          {/* Rounded Rectangles */}
          <div className="absolute top-1/3 right-10 w-20 h-16 bg-white/10 rounded-2xl opacity-20 rotate-12"></div>
          <div className="absolute bottom-1/3 left-20 w-24 h-20 bg-white/10 rounded-3xl opacity-15 -rotate-6"></div>
          
          {/* Leaf Motifs */}
          <div className="absolute top-16 right-1/4 w-16 h-16 bg-white/10 rounded-full opacity-15" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-white/15 rounded-full opacity-20" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        </div>

        {/* Banner Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="relative w-full h-full bg-transparent">
              {/* Content */}
              <div className="relative h-full flex items-center z-10 bg-transparent py-4 md:py-0">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 w-full bg-transparent">
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                    {/* Image - Above on Mobile, Right on Desktop */}
                    <div className="relative z-20 bg-transparent order-1 md:order-2 w-full md:w-auto">
                      <div className="relative w-full max-w-sm md:max-w-lg mx-auto flex items-center justify-center bg-transparent" style={{ backgroundColor: 'transparent', background: 'none' }}>
                         <img
                           src={slide.image}
                           alt={slide.title}
                           className="w-full h-auto object-contain max-h-[350px] md:max-h-[600px] lg:max-h-[700px] rounded-2xl"
                           style={{ 
                             mixBlendMode: 'normal',
                             backgroundColor: 'transparent',
                             background: 'none',
                             display: 'block'
                           }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images2/hero sec(main photo).jpg';
                            target.style.backgroundColor = 'transparent';
                            target.style.background = 'none';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Text Content - Below on Mobile, Left on Desktop */}
                    <div className="text-white space-y-2 md:space-y-4 lg:space-y-6 z-20 text-center md:text-left order-2 md:order-1">
                      {/* Small Script Text */}
                      <p className="text-xl md:text-2xl lg:text-3xl font-script text-white/90 mb-1 md:mb-2">
                        Amazing
                      </p>
                      
                      {/* Main Title - Large White with Heading Font (same as Categories) */}
                      <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight text-white">
                        {slide.title || 'Premium Indian Sarees'}
                      </h1>
                      
                      {/* Modern Stunning Tagline - Centered */}
                      <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 font-light max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Where Tradition Meets Elegance, Every Thread Tells a Story
                      </p>
                      
                      {/* CTA Button - White with Dark Blue Text */}
                      <div className="pt-2 md:pt-4">
                        <Link
                          href={slide.link || '/products'}
                          className="inline-block bg-white text-deep-indigo hover:bg-white/95 px-6 py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-4 rounded-lg font-semibold text-sm md:text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform border border-deep-indigo/20"
                        >
                          {slide.linkText || 'Shop Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Subtle Design */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => {
                const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                handleSlideChange(newSlide);
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-deep-indigo hover:text-navy-blue p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
                handleSlideChange(newSlide);
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-deep-indigo hover:text-navy-blue p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Dots Indicator - Subtle */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-8 h-2 shadow-md' 
                      : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;

