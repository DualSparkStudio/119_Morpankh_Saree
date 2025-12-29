'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface FlashSaleProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: number;
  compareAtPrice?: number;
  discount?: number;
}

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

const getProductImage = (product: FlashSaleProduct, index: number = 0) => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  return images2Fallbacks[index % images2Fallbacks.length];
};

const getProductPrice = (product: FlashSaleProduct) => product.basePrice;

interface FlashSaleProps {
  products?: FlashSaleProduct[];
  endTime?: string;
}

export default function FlashSale({ products = [], endTime }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setEnded(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endTime]);

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-[#312e81] mb-2">
              Flash Sale
            </h2>
            <p className="text-gray-600">Limited time offers - Shop now!</p>
          </div>
          
          {!ended && endTime && (
            <div className="flex items-center gap-4 bg-[#312e81] text-white px-6 py-3 rounded-lg">
              <Clock className="w-5 h-5" />
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs">Hrs</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs">Min</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs">Sec</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.slice(0, 5).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>
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

        <div className="text-center mt-8">
          <Link
            href="/products?flashSale=true"
            className="inline-block bg-[#312e81] hover:bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Flash Sale Items
          </Link>
        </div>
      </div>
    </section>
  );
}

