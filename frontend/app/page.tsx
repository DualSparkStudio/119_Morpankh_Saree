'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/HomePage/HeroCarousel';
import CategorySection from '@/components/HomePage/CategorySection';
import PremiumPatterns from '@/components/HomePage/PremiumPatterns';
import TrendingPatterns from '@/components/HomePage/TrendingPatterns';
import GoogleReviews from '@/components/HomePage/GoogleReviews';

// Loading fallback component
const SectionSkeleton = () => (
  <div className="py-16 md:py-20 bg-gradient-to-b from-soft-cream to-white">
    <div className="container mx-auto px-4">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <Suspense fallback={<SectionSkeleton />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <PremiumPatterns />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <TrendingPatterns />
      </Suspense>
      
      {/* Google Reviews Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <GoogleReviews />
      </Suspense>
      
      {/* General See More Button */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-deep-indigo hover:bg-navy-blue text-white px-8 py-4 rounded-full font-semibold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span>Browse All Products</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
