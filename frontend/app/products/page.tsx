'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { productsApi, Product } from '@/lib/api/products';
import { categoriesApi, Category } from '@/lib/api/categories';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [highlight, setHighlight] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);

  const highlights = ['All', 'Best Seller', 'New Arrivals', 'Sale'];

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

  // Initialize category filter from URL query parameter
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      const category = categories.find(c => c.slug === categoryParam);
      if (category) {
        setSelectedCategories([category.name]);
      }
    }
  }, [searchParams, categories]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [selectedCategories, priceRange, highlight]);

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

  const getImageUrl = (image: string | undefined, product?: any, index: number = 0): string => {
    if (!image || image.trim() === '') {
      return '';
    }
    
    // Convert old Google Drive format to thumbnail format for better reliability
    if (image.includes('drive.google.com/uc?export=view&id=')) {
      const fileIdMatch = image.match(/id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        image = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1920`;
      }
    }
    
    // If it's already a full URL, return as is (but add cache busting if product was updated)
    if (image.startsWith('http://') || image.startsWith('https://')) {
      // Add cache busting for external URLs using product updatedAt timestamp
      if (product?.updatedAt) {
        const separator = image.includes('?') ? '&' : '?';
        return `${image}${separator}v=${new Date(product.updatedAt).getTime()}`;
      }
      return image;
    }
    
    // If it starts with /uploads, it's from the backend
    if (image.startsWith('/uploads')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      let url = '';
      if (apiUrl.startsWith('http')) {
        // Development: extract base URL
        const baseUrl = apiUrl.replace('/api', '');
        url = `${baseUrl}${image}`;
      } else {
        // Production: same domain, use image path directly
        url = image;
      }
      // Add cache busting using product updatedAt timestamp
      if (product?.updatedAt) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${new Date(product.updatedAt).getTime()}`;
      }
      return url;
    }
    
    // Old hardcoded paths like /images/products/... don't exist - return empty
    if (image.startsWith('/images/products/')) {
      return '';
    }
    
    // If it starts with /, it might be a frontend public image
    if (image.startsWith('/')) {
      return image;
    }
    
    // Otherwise, return as is
    return image;
  };

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

              {/* Highlight Section */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-deep-indigo mb-4">
                  Highlight
                </h3>
                <div className="space-y-2">
                  {highlights.map((item) => (
                    <button
                      key={item}
                      onClick={() => setHighlight(item.toLowerCase().replace(' ', '-'))}
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
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-[7/8] bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 overflow-hidden">
                      {(() => {
                        const imageUrl = getImageUrl(product.images?.[0], product, products.indexOf(product));
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
                      {/* Hover UI */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Heart className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-bold text-deep-indigo">₹{product.basePrice.toLocaleString()}</p>
                        {product.compareAtPrice && (
                          <p className="text-sm text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </Link>
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
