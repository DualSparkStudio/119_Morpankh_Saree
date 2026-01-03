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
  colorImages?: Array<{ color: string; images: string[]; isActive?: boolean }>;
  colors?: Array<{ color: string; images: string[]; isActive?: boolean }>; // Legacy
  basePrice: number;
  compareAtPrice?: number;
  category?: {
    name: string;
  };
}

// Helper to get random image from colorImages, fallback to product images
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
  
  // Old hardcoded paths like /images/products/... don't exist - return empty
  if (image.startsWith('/images/products/')) {
    return '';
  }
  
  // Convert old Google Drive format to thumbnail format for better reliability
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
                  {(() => {
                    const imageSrc = getProductImage(product, index);
                    const originalImage = product.images?.[0];
                    // Use regular img tag for old hardcoded paths or backend images to avoid Next.js Image optimization errors
                    const shouldUseRegularImg = !originalImage || 
                      originalImage.startsWith('/uploads') || 
                      originalImage.startsWith('http') ||
                      originalImage.startsWith('/images/products/');
                    
                    return shouldUseRegularImg ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    );
                  })()}
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

