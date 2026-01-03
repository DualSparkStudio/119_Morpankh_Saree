'use client';

import { useState, useEffect } from 'react';
import { Heart, Eye, ShoppingCart, Star, Percent } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { productsApi, Product } from '@/lib/api/products';
import { getImageUrl } from '@/lib/utils/imageHelper';

const PremiumPatterns = () => {
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
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      });
      setProducts(data.products.filter(p => p.isActive && (p as any).showInPremium).slice(0, 10));
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


  const isInWishlist = (productId: string) => {
    return wishlist ? wishlist.includes(productId) : false;
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get image for cart - use random from colorImages or fallback to product.images
    let cartImage: string | undefined = undefined;
    const colorImages = product.colorImages || product.colors || [];
    if (colorImages.length > 0) {
      const allImages: string[] = [];
      colorImages.forEach((color: any) => {
        if (color.isActive !== false && color.images && Array.isArray(color.images)) {
          color.images.forEach((img: string) => {
            if (img && img.trim() !== '') {
              allImages.push(img);
            }
          });
        }
      });
      if (allImages.length > 0) {
        cartImage = allImages[Math.floor(Math.random() * allImages.length)];
      }
    }
    if (!cartImage) {
      cartImage = product.images?.[0];
    }
    
    addToCart({
      id: `product-${product.id}`,
      productId: product.id,
      productSlug: product.slug,
      quantity: 1,
      price: product.basePrice,
      productName: product.name,
      productImage: cartImage || '',
    });
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-soft-cream">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative mb-12">
          <div className="text-center w-full">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-deep-indigo mb-2">
              Premium Patterns
            </h2>
            <p className="text-gray-600 text-lg font-light">Exquisite designs for the modern woman</p>
          </div>
          <Link
            href="/products?premium=true"
            className="hidden md:absolute md:top-0 md:right-0 md:flex items-center gap-2 text-deep-indigo hover:text-navy-blue font-medium text-lg transition-colors group"
          >
            <span>See more</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
            {products.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const discount = product.compareAtPrice 
                ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
                : 0;
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-deep-indigo/50 relative transform hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[7/8] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-indigo/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                      {(() => {
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
                        
                        const imageUrl = getImageUrl(productImage, products.indexOf(product));
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
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
                    </Link>
                    
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
                        toggleWishlist(e, product.id);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-50 shadow-lg ${
                        inWishlist 
                          ? 'bg-sale-red text-white' 
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* Quick Actions on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 pointer-events-none z-40">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                        }}
                        className="bg-white text-deep-indigo px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-deep-indigo hover:text-white transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 pointer-events-auto z-50 relative"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(e, product);
                        }}
                        className="bg-sale-red text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-sale-red-light transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 pointer-events-auto z-50 relative"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                  
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
                      onClick={(e) => handleAddToCart(e, product)}
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
        
        {/* Mobile See More Link */}
        <div className="mt-8 md:hidden text-center">
          <Link 
            href="/products?premium=true" 
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

export default PremiumPatterns;

