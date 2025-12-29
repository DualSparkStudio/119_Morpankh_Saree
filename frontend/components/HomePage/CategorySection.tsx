'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { categoriesApi, Category } from '@/lib/api/categories';

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0 || loading) return;

    const setupAnimation = () => {
      const content = scrollContentRef.current;
      if (!content) return;

      // Wait for next frame to ensure layout is complete
      requestAnimationFrame(() => {
        // Calculate the width of one complete set of categories
        const children = Array.from(content.children) as HTMLElement[];
        if (children.length === 0) return;

        // Get width of first set (first categories.length items)
        let singleSetWidth = 0;
        for (let i = 0; i < categories.length; i++) {
          if (children[i]) {
            const rect = children[i].getBoundingClientRect();
            singleSetWidth += rect.width;
            // Add gap (gap-6 = 24px on mobile, gap-8 = 32px on desktop)
            if (i < categories.length - 1) {
              singleSetWidth += window.innerWidth >= 768 ? 32 : 24;
            }
          }
        }

        // Only proceed if we have a valid width
        if (singleSetWidth === 0) return;
        
        // Create seamless infinite scroll using CSS animation
        // We move exactly one set width, then it loops seamlessly
        const keyframes = [
          { transform: 'translateX(0)' },
          { transform: `translateX(-${singleSetWidth}px)` }
        ];

        const options: KeyframeAnimationOptions = {
          duration: categories.length * 2500, // 2.5 seconds per item for smooth speed
          iterations: Infinity,
          easing: 'linear',
        };

        // Cancel existing animation if any
        if (animationRef.current) {
          animationRef.current.cancel();
        }

        // Start new animation with hardware acceleration
        animationRef.current = content.animate(keyframes, options);
      });
    };

    // Wait for DOM to be ready and images to load
    const timeoutId = setTimeout(() => {
      setupAnimation();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, [categories, loading]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCategories(data.filter(c => c.isActive).slice(0, 8));
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return '/images/cotton-saree.png';
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

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-soft-cream to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-deep-indigo mb-2">
              Categories
            </h2>
            <p className="text-gray-600 text-lg font-light">Explore our exquisite collection</p>
          </div>
          <Link 
            href="/products" 
            className="hidden md:flex items-center gap-2 text-deep-indigo hover:text-navy-blue font-medium text-lg transition-colors group"
          >
            <span>See more</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>No categories available</p>
          </div>
        ) : (
          <div 
            ref={scrollWrapperRef}
            className="overflow-hidden pb-4 -mx-4 px-4"
            onMouseEnter={() => {
              if (animationRef.current) {
                animationRef.current.pause();
              }
            }}
            onMouseLeave={() => {
              if (animationRef.current) {
                animationRef.current.play();
              }
            }}
          >
            <div 
              ref={scrollContentRef}
              className="flex gap-6 md:gap-8 will-change-transform"
              style={{ width: 'fit-content' }}
            >
              {/* Render categories multiple times for seamless loop */}
              {[...categories, ...categories, ...categories].map((category, index) => (
                <Link
                  key={`${category.id}-${index}`}
                  href={`/products?category=${category.slug}`}
                  className="group flex flex-col items-center gap-4 min-w-[140px] md:min-w-[160px] cursor-pointer flex-shrink-0"
                >
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-deep-indigo">
                    <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo/20 to-navy-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/cotton-saree.png';
                      }}
                    />
                    {/* Decorative ring on hover */}
                    <div className="absolute inset-0 rounded-xl ring-2 ring-deep-indigo/0 group-hover:ring-deep-indigo/50 transition-all duration-300"></div>
                  </div>
                  <span className="text-base md:text-lg font-medium text-gray-700 group-hover:text-deep-indigo transition-colors duration-300">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Mobile See More Link */}
        <div className="mt-8 md:hidden text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-deep-indigo hover:text-navy-blue font-medium text-lg transition-colors"
          >
            <span>See more</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

