'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroBanner {
  id: string;
  title?: string;
  description?: string;
  image: string;
  link?: string;
  linkText?: string;
}

interface HeroProps {
  banners?: HeroBanner[];
}

export default function Hero({ banners = [] }: HeroProps) {
  const banner = banners[0] || {
    id: '1',
    title: 'Premium Indian Sarees',
    description: 'Discover elegance in every thread',
    image: '/images/hero-banner.jpg',
    link: '/products',
    linkText: 'Shop Now',
  };

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={banner.image}
          alt={banner.title || 'Hero Banner'}
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#312e81]/80 to-[#312e81]/40" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          {banner.title && (
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {banner.title}
            </h1>
          )}
          {banner.description && (
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              {banner.description}
            </p>
          )}
          {banner.link && (
            <Link
              href={banner.link}
              className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8941f] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {banner.linkText || 'Shop Now'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

