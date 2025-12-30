'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart, Star, Percent } from 'lucide-react';
import { useStore } from '@/lib/store';
import { productsApi, Product } from '@/lib/api/products';

const TrendingPatterns = () => {
  const { wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll({
        limit: 8,
        sort: 'createdAt',
        order: 'desc',
      });
      setProducts(data.products.filter(p => p.isActive && p.isFeatured).slice(0, 8));
    } catch (error: any) {
      // Silently handle rate limiting (429) errors - fallback images will be used
      if (error?.response?.status !== 429) {
        console.error('Error loading products:', error);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string | undefined, product?: Product, index: number = 0): string => {
    // If image exists and is valid, return it
    if (image && image.trim() !== '') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        // Add cache busting for external URLs using product updatedAt timestamp
        if (product?.updatedAt) {
          const separator = image.includes('?') ? '&' : '?';
          return `${image}${separator}v=${new Date(product.updatedAt).getTime()}`;
        }
        return image;
      }
      if (image.startsWith('/')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const baseUrl = apiUrl.replace('/api', '');
        let url = `${baseUrl}${image}`;
        // Add cache busting using product updatedAt timestamp
        if (product?.updatedAt) {
          const separator = url.includes('?') ? '&' : '?';
          url = `${url}${separator}v=${new Date(product.updatedAt).getTime()}`;
        }
        return url;
      }
      return image;
    }
    
    // No fallback - return empty string
    return '';
  };

  const isInWishlist = (productId: string) => {
    return wishlist ? wishlist.includes(productId) : false;
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-soft-cream to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-deep-indigo mb-3">
              Trending Patterns
            </h2>
            <p className="text-gray-600 text-lg font-light">What's hot right now</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-deep-indigo hover:bg-navy-blue text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>See more</span>
            <span>→</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>No trending products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
            {products.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const discount = product.compareAtPrice 
                ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
                : 0;
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-deep-indigo/30 relative"
                >
                  {/* Image Container */}
                  <Link href={`/products/${product.slug}`} className="block relative">
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {(() => {
                        const imageUrl = getImageUrl(product.images?.[0], product, products.indexOf(product));
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        );
                      })()}
                      
                      {/* Discount Badge - Top Left */}
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-sale-red text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                          <Percent className="w-3 h-3" />
                          <span>{discount}% OFF</span>
                        </div>
                      )}
                      
                      {/* Wishlist Button - Top Right */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (inWishlist) {
                            removeFromWishlist(product.id);
                          } else {
                            addToWishlist(product.id);
                          }
                        }}
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-lg ${
                          inWishlist 
                            ? 'bg-sale-red text-white' 
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                        }`}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      
                      {/* Quick Actions on Hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="bg-white text-deep-indigo px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-deep-indigo hover:text-white transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Quick View</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({
                              id: `product-${product.id}`,
                              productId: product.id,
                              quantity: 1,
                              price: product.basePrice,
                              productName: product.name,
                              productImage: product.images?.[0] || '',
                            });
                          }}
                          className="bg-sale-red text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-sale-red-light transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-2.5 md:p-3 bg-white">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-heading font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-deep-indigo transition-colors text-sm md:text-base leading-tight min-h-[2rem]">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Rating - Only show if reviews exist and > 0 */}
                    {product._count?.reviews && product._count.reviews > 0 ? (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product._count.reviews})</span>
                      </div>
                    ) : null}
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg md:text-xl font-bold text-sale-red">₹{product.basePrice.toLocaleString()}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                      )}
                    </div>
                    
                    {/* Add to Cart Button - Always Visible */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: `product-${product.id}`,
                          productId: product.id,
                          quantity: 1,
                          price: product.basePrice,
                          productName: product.name,
                          productImage: product.images?.[0] || '',
                        });
                      }}
                      className="w-full bg-deep-indigo hover:bg-navy-blue text-white py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingPatterns;

