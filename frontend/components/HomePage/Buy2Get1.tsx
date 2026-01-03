'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  colorImages?: Array<{ color: string; images: string[]; isActive?: boolean }>;
  colors?: Array<{ color: string; images: string[]; isActive?: boolean }>; // Legacy
  basePrice: number;
  compareAtPrice?: number;
}

const getProductImage = (product: Product, index: number = 0) => {
  // Get random image from any color that has images, otherwise from product images
  let productImage: string | undefined = undefined;
  
  // Get colorImages (new structure) or colors (legacy)
  const colorImages = product.colorImages || product.colors || [];
  
  if (colorImages && Array.isArray(colorImages) && colorImages.length > 0) {
    // Collect all images from all active colors
    const allImages: string[] = [];
    colorImages.forEach((color: any) => {
      if (color && color.isActive !== false && color.images && Array.isArray(color.images)) {
        color.images.forEach((img: string) => {
          if (img && typeof img === 'string' && img.trim() !== '') {
            allImages.push(img.trim());
          }
        });
      }
    });
    
    // Pick a random image from valid images
    if (allImages.length > 0) {
      productImage = allImages[Math.floor(Math.random() * allImages.length)];
    }
  }
  
  // Fallback to product images if no color images found
  if (!productImage && product.images && Array.isArray(product.images) && product.images.length > 0) {
    // Filter out empty/invalid images
    const validImages = product.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    if (validImages.length > 0) {
      productImage = validImages[0];
    }
  }
  
  if (!productImage || typeof productImage !== 'string' || productImage.trim() === '') return '';
  
  // Process the image URL
  let image = productImage;
  
  // Convert old Google Drive format to thumbnail format
  if (image.includes('drive.google.com/uc?export=view&id=')) {
    const fileIdMatch = image.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      image = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1920`;
    }
  }
  
  // Handle /uploads paths
  if (image.startsWith('/uploads')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    if (apiUrl.startsWith('http')) {
      const baseUrl = apiUrl.replace('/api', '');
      return `${baseUrl}${image}`;
    }
    return image;
  }
  
  return image;
};

interface Buy2Get1Props {
  products?: Product[];
}

export default function Buy2Get1({ products = [] }: Buy2Get1Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-[#f4e4bc] to-[#fffef9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#d4af37] text-white px-6 py-2 rounded-full mb-4">
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Special Offer</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-[#312e81] mb-4">
            Buy 2 Get 1 Free
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Mix and match any 2 sarees and get the third one absolutely free! 
            Perfect opportunity to expand your collection.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md mb-3">
                  <Image
                    src={getProductImage(product, index)}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-[#d4af37] text-white px-3 py-1 rounded text-xs font-semibold">
                    Buy 2 Get 1
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#312e81]">
                    ₹{product.basePrice.toLocaleString()}
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
            href="/products?offer=buy2get1"
            className="inline-flex items-center gap-2 bg-[#312e81] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Explore Collection
            <Gift className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

