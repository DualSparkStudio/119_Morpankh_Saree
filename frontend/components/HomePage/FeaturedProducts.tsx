'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: number;
  compareAtPrice?: number;
  category?: {
    name: string;
  };
}

// Helper to get first image with fallback
const images2Fallbacks = [
  '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM (1).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM (1).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (1).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (2).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM (1).jpeg',
];

const getProductImage = (product: Product, index: number = 0) => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  return images2Fallbacks[index % images2Fallbacks.length];
};

const getProductPrice = (product: Product) => product.basePrice;

interface FeaturedProductsProps {
  products?: Product[];
  title?: string;
}

export default function FeaturedProducts({ products = [], title = 'Featured Products' }: FeaturedProductsProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useStore();

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-[#312e81] mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            Handpicked collection of premium sarees
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                  <Image
                    src={getProductImage(product, index)}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = images2Fallbacks[index % images2Fallbacks.length];
                    }}
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                      wishlist.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                  {product.compareAtPrice && (
                    <div className="absolute top-2 left-2 bg-[#d4af37] text-white px-2 py-1 rounded text-xs font-semibold">
                      Sale
                    </div>
                  )}
                </div>
                {product.category && (
                  <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
                )}
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#312e81]">
                    ₹{getProductPrice(product).toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block bg-[#312e81] hover:bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

