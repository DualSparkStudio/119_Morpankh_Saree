'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { productsApi, Product } from '@/lib/api/products';
import { categoriesApi, Category } from '@/lib/api/categories';
import { useStore } from '@/lib/store';
import { getImageUrl } from '@/lib/utils/imageHelper';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [highlight, setHighlight] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterPremium, setFilterPremium] = useState(false);
  const [filterTrending, setFilterTrending] = useState(false);

  const highlights = ['All', 'Best Seller', 'New Arrivals', 'Sale'];

  // Scroll to top when component mounts or URL query params change
  useEffect(() => {
    // Small delay to ensure Lenis is initialized
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Try to access Lenis instance if available
        const lenisInstance = (window as any).lenis;
        if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
          lenisInstance.scrollTo(0, { immediate: true });
        } else {
          // Fallback to regular scroll
          window.scrollTo({ top: 0, behavior: 'auto' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data.filter(c => c.isActive));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Initialize filters from URL query parameters
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      const category = categories.find(c => c.slug === categoryParam);
      if (category) {
        setSelectedCategories([category.name]);
      }
    }
    
    // Check for premium and trending filters
    const premiumParam = searchParams?.get('premium');
    if (premiumParam === 'true') {
      setFilterPremium(true);
      setFilterTrending(false);
      setHighlight('all');
    }
    
    const trendingParam = searchParams?.get('trending');
    if (trendingParam === 'true') {
      setFilterTrending(true);
      setFilterPremium(false);
      setHighlight('all');
    }
  }, [searchParams, categories]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategories.length > 0 
        ? categories.find(c => c.name === selectedCategories[0])?.id 
        : undefined;
      const data = await productsApi.getAll({
        category: categoryParam,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 50000 ? priceRange.max : undefined,
        premium: filterPremium ? true : undefined,
        trending: filterTrending ? true : undefined,
        limit: 20,
        sort: highlight === 'new-arrivals' ? 'createdAt' : highlight === 'best-seller' ? 'basePrice' : 'createdAt',
        order: highlight === 'new-arrivals' ? 'desc' : 'desc',
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce product loading to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300); // Wait 300ms after user stops changing filters

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, priceRange, highlight, categories, filterPremium, filterTrending]);


  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold text-deep-indigo mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Min: ₹{priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Max: ₹{priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold text-deep-indigo mb-4">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="w-4 h-4 text-royal-blue rounded"
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Premium/Trending Active Filters */}
              {(filterPremium || filterTrending) && (
                <div className="mb-8">
                  <h3 className="font-heading text-lg font-semibold text-deep-indigo mb-4">
                    Active Filters
                  </h3>
                  <div className="space-y-2">
                    {filterPremium && (
                      <div className="flex items-center justify-between bg-deep-indigo text-white px-3 py-2 rounded">
                        <span className="text-sm font-medium">Premium Patterns</span>
                        <button
                          onClick={() => {
                            setFilterPremium(false);
                            const params = new URLSearchParams(window.location.search);
                            params.delete('premium');
                            window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                          }}
                          className="text-white hover:text-red-200 text-lg leading-none"
                          aria-label="Remove premium filter"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {filterTrending && (
                      <div className="flex items-center justify-between bg-deep-indigo text-white px-3 py-2 rounded">
                        <span className="text-sm font-medium">Trending Patterns</span>
                        <button
                          onClick={() => {
                            setFilterTrending(false);
                            const params = new URLSearchParams(window.location.search);
                            params.delete('trending');
                            window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                          }}
                          className="text-white hover:text-red-200 text-lg leading-none"
                          aria-label="Remove trending filter"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Highlight Section */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-deep-indigo mb-4">
                  Highlight
                </h3>
                <div className="space-y-2">
                  {highlights.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setHighlight(item.toLowerCase().replace(' ', '-'));
                        // Clear premium/trending filters when selecting highlight
                        if (filterPremium || filterTrending) {
                          setFilterPremium(false);
                          setFilterTrending(false);
                          const params = new URLSearchParams(window.location.search);
                          params.delete('premium');
                          params.delete('trending');
                          window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                        }
                      }}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        highlight === item.toLowerCase().replace(' ', '-')
                          ? 'bg-royal-blue text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Side - Product Grid */}
          <div className="flex-1">
            {/* Page Title with Active Filter Indicator */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-2">
                {filterPremium ? 'Premium Patterns' : filterTrending ? 'Trending Patterns' : 'All Products'}
              </h1>
              {(filterPremium || filterTrending) && (
                <p className="text-gray-600">
                  {filterPremium 
                    ? 'Discover our exquisite premium collection' 
                    : 'Explore what\'s trending right now'}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo mx-auto"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">No products found</p>
                </div>
              ) : (
                products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="relative aspect-[7/8] bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 overflow-hidden">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                      {(() => {
                        // Get random image from any color that has images, otherwise from product images
                        let productImage: string | undefined = undefined;
                        
                        // Get colorImages (new structure) or colors (legacy)
                        const colorImages = product.colorImages || product.colors || [];
                        
                        if (colorImages.length > 0) {
                          // Collect all images from all active colors
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
                          
                          // Pick a random image
                          if (allImages.length > 0) {
                            productImage = allImages[Math.floor(Math.random() * allImages.length)];
                          }
                        }
                        
                        // Fallback to product images if no color images found
                        if (!productImage) {
                          productImage = product.images?.[0];
                        }
                        
                        const imageUrl = getImageUrl(productImage, products.indexOf(product));
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.opacity = '1';
                            }}
                            style={{ opacity: 0, transition: 'opacity 0.3s' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        );
                      })()}
                    </Link>
                    {/* Hover UI */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (wishlist.includes(product.id)) {
                            removeFromWishlist(product.id);
                          } else {
                            addToWishlist(product.id);
                          }
                        }}
                        className={`bg-white p-2 rounded-full hover:bg-gray-100 transition-colors pointer-events-auto z-30 ${
                          wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-700'
                        }`}
                        aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors pointer-events-auto z-30"
                        aria-label="Quick view"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart({
                            id: `product-${product.id}`,
                            productId: product.id,
                            productSlug: product.slug,
                            quantity: 1,
                            price: product.basePrice,
                            productName: product.name,
                            productImage: (() => {
                              const colorImages = product.colorImages || product.colors || [];
                              if (colorImages.length > 0) {
                                const allImages: string[] = [];
                                colorImages.forEach((color: any) => {
                                  if (color.images && Array.isArray(color.images)) {
                                    allImages.push(...color.images.filter((img: string) => img && img.trim() !== ''));
                                  }
                                });
                                if (allImages.length > 0) {
                                  return allImages[Math.floor(Math.random() * allImages.length)];
                                }
                              }
                              return product.images?.[0] || '';
                            })(),
                          });
                        }}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors pointer-events-auto z-30"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-deep-indigo transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold text-deep-indigo">₹{product.basePrice.toLocaleString()}</p>
                      {product.compareAtPrice && (
                        <p className="text-sm text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button className="bg-royal-blue hover:bg-deep-indigo text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-soft-cream py-8"><div className="container mx-auto px-4">Loading...</div></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
