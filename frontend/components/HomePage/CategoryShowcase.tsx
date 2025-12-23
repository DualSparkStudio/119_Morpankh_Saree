'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

interface CategoryShowcaseProps {
  categories?: Category[];
}

export default function CategoryShowcase({ categories = [] }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-[#fffef9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-[#312e81] mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Discover our curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3 shadow-md">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#312e81] to-[#1e3a8a] flex items-center justify-center">
                      <span className="text-white text-2xl font-heading">{category.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-heading text-xl font-semibold mb-1">{category.name}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

