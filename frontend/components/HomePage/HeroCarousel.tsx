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
    } catch (error) {
      console.error('Error loading banners:', error);
      // Fallback to default banner with main hero image
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
      <section className="relative h-[600px] md:h-[750px] lg:h-[850px] overflow-hidden bg-gradient-to-br from-deep-indigo via-navy-blue to-deep-indigo flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative h-[650px] md:h-[800px] lg:h-[900px] overflow-hidden bg-gradient-to-br from-deep-indigo via-navy-blue to-deep-indigo"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-full">
        {/* Banner Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="relative w-full h-full">
              {/* Background Image - Left Side with Blend */}
              <div className="absolute inset-0">
                <div className="absolute left-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                    style={{ mixBlendMode: 'overlay', opacity: 0.4 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images2/hero sec(main photo).jpg';
                    }}
                  />
                </div>
              </div>
              
              {/* Gradient Overlay - Elegant blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-deep-indigo/90 via-deep-indigo/80 to-deep-indigo/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center z-10">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 w-full">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                    {/* Left Side - Text Content */}
                    <div className="text-white space-y-5 md:space-y-6 z-20">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {slide.badge && (
                          <div className="inline-flex items-center gap-2 bg-sale-red text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg border-2 border-white/30 animate-pulse">
                            <Tag className="w-4 h-4" />
                            <span>{slide.badge}</span>
                          </div>
                        )}
                        
                        {slide.discount && (
                          <div className="inline-block bg-deep-indigo/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/20 shadow-md">
                            {slide.discount}
                          </div>
                        )}
                      </div>
                      
                      {/* Main Title - Elegant Typography */}
                      <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[1.1]">
                        <span className="block text-white drop-shadow-2xl mb-1">
                          {slide.title.split(' ').slice(0, -1).join(' ')}
                        </span>
                        <span className="block text-white drop-shadow-2xl bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
                          {slide.title.split(' ').slice(-1).join(' ')}
                        </span>
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light max-w-xl leading-relaxed mt-4">
                        {slide.subtitle}
                      </p>
                      
                      {/* CTA Buttons - Enhanced */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Link
                          href={slide.link || '/products'}
                          className="group inline-flex items-center justify-center gap-2 bg-sale-red hover:bg-sale-red-light text-white px-10 py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 shadow-2xl hover:shadow-sale-red/50 hover:scale-105 transform border-2 border-sale-red/50"
                        >
                          <span>{slide.linkText || 'Shop Now'}</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/categories"
                          className="inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-deep-indigo hover:text-deep-indigo px-10 py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 shadow-xl hover:scale-105 transform border-2 border-white/50"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span>Explore</span>
                        </Link>
                      </div>
                      
                      {/* Features - Enhanced */}
                      <div className="flex flex-wrap gap-5 pt-6">
                        <div className="flex items-center gap-2.5 text-white/90 text-sm md:text-base font-medium">
                          <div className="w-2.5 h-2.5 bg-sale-red rounded-full shadow-lg animate-pulse"></div>
                          <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/90 text-sm md:text-base font-medium">
                          <div className="w-2.5 h-2.5 bg-sale-red rounded-full shadow-lg animate-pulse"></div>
                          <span>Easy Returns</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/90 text-sm md:text-base font-medium">
                          <div className="w-2.5 h-2.5 bg-sale-red rounded-full shadow-lg animate-pulse"></div>
                          <span>Authentic Products</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Showcase Image Frame */}
                    <div className="hidden lg:block relative z-20">
                      <div className="relative w-full max-w-lg mx-auto">
                        {/* Main Showcase Frame */}
                        <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20 shadow-2xl">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images2/hero sec(main photo).jpg';
                              }}
                            />
                            {/* Image Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-sale-red/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-deep-indigo/30 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Elegant Design */}
        <button
          onClick={() => {
            const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            handleSlideChange(newSlide);
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-deep-indigo hover:text-sale-red p-4 md:p-5 rounded-full shadow-2xl transition-all duration-300 z-30 hover:scale-110 group border-2 border-white/50 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => {
            const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            handleSlideChange(newSlide);
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-deep-indigo hover:text-sale-red p-4 md:p-5 rounded-full shadow-2xl transition-all duration-300 z-30 hover:scale-110 group border-2 border-white/50 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Dots Indicator - Refined */}
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30 bg-white/10 backdrop-blur-lg px-5 py-3 rounded-full border border-white/20 shadow-xl">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-sale-red w-10 h-3 shadow-lg shadow-sale-red/50' 
                  : 'bg-white/60 hover:bg-white/90 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Elegant Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-soft-cream via-soft-cream/90 to-transparent pointer-events-none z-10">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-deep-indigo/30 to-transparent"></div>
        {/* Decorative wave pattern */}
        <svg className="absolute bottom-0 left-0 w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 Q300,40 600,60 T1200,60 L1200,120 L0,120 Z" fill="url(#wave-gradient)" opacity="0.1"/>
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default HeroCarousel;

