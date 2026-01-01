'use client';

import { Product, ProductVariant, productsApi } from '@/lib/api/products';
import { useStore } from '@/lib/store';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Check, Truck, Shield, RotateCcw, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageZoom, setImageZoom] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      let productData: Product;
      
      // Try to load by slug first, if that fails and slug looks like an ID, try by ID
      try {
        productData = await productsApi.getBySlug(slug);
      } catch (slugError: any) {
        // If slug lookup fails and slug looks like an ID (cuid format), try by ID
        if (slug.length === 25 && slugError?.response?.status === 404) {
          try {
            productData = await productsApi.getById(slug);
            // Redirect to slug-based URL for better SEO
            if (productData.slug && productData.slug !== slug) {
              router.replace(`/products/${productData.slug}`);
              return;
            }
          } catch (idError) {
            throw slugError; // Throw original error if ID lookup also fails
          }
        } else {
          throw slugError;
        }
      }
      
      setProduct(productData);
      
      // Set default color if variants exist
      if (productData.variants && productData.variants.length > 0) {
        const firstVariant = productData.variants[0];
        if (firstVariant.color) {
          setSelectedColor(firstVariant.color);
          setSelectedVariant(firstVariant.id);
        }
      }
      
      // Load related products from the same category
      if (productData.category?.id) {
        const related = await productsApi.getAll({
          category: productData.category.id,
          limit: 4,
        });
        setRelatedProducts(
          related.products
            .filter(p => p.id !== productData.id && p.isActive)
            .slice(0, 4)
        );
      }
    } catch (error: any) {
      if (error?.response?.status !== 429) {
        console.error('Error loading product:', error);
      }
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string | undefined, product?: Product): string => {
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
    
    if (image.startsWith('http://') || image.startsWith('https://')) {
      if (product?.updatedAt) {
        const separator = image.includes('?') ? '&' : '?';
        return `${image}${separator}v=${new Date(product.updatedAt).getTime()}`;
      }
      return image;
    }
    
    if (image.startsWith('/uploads')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      let url = '';
      if (apiUrl.startsWith('http')) {
        const baseUrl = apiUrl.replace('/api', '');
        url = `${baseUrl}${image}`;
      } else {
        url = image;
      }
      if (product?.updatedAt) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${new Date(product.updatedAt).getTime()}`;
      }
      return url;
    }
    
    if (image.startsWith('/')) {
      return image;
    }
    
    return image;
  };

  // Get available colors from variants
  const getAvailableColors = () => {
    if (!product?.variants) return [];
    const colors = new Map<string, { variant: ProductVariant; count: number }>();
    product.variants.forEach(variant => {
      if (variant.color) {
        const existing = colors.get(variant.color);
        if (existing) {
          colors.set(variant.color, { variant: existing.variant, count: existing.count + 1 });
        } else {
          colors.set(variant.color, { variant, count: 1 });
        }
      }
    });
    return Array.from(colors.values()).map(item => item.variant);
  };

  // Get images for selected color variant
  const getDisplayImages = () => {
    if (!product) return [];
    
    // If color is selected, try to get variant-specific images
    if (selectedColor && product.variants) {
      const variant = product.variants.find(v => v.color === selectedColor);
      // If variant has images, use them; otherwise use product images
    }
    
    // Use product images from database - no hardcoded fallbacks
    if (product.images && product.images.length > 0) {
      return product.images.filter(img => img && img.trim() !== '');
    }
    
    // Return empty array if no images - let the UI handle the display
    return [];
  };

  const isInWishlist = (productId: string) => {
    return wishlist ? wishlist.includes(productId) : false;
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variant = selectedVariant 
      ? product.variants?.find(v => v.id === selectedVariant)
      : null;
    
    // Get the actual product image from the product data
    const productImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '';
    
    addToCart({
      id: `product-${product.id}${variant ? `-${variant.id}` : ''}`,
      productId: product.id,
      productSlug: product.slug,
      variantId: variant?.id || undefined,
      quantity: quantity,
      price: variant?.price || product.basePrice,
      productName: product.name,
      productImage: productImage,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    if (selectedVariant) {
      const variant = product.variants?.find(v => v.id === selectedVariant);
      return variant?.price || product.basePrice;
    }
    return product.basePrice;
  };

  const getStockCount = () => {
    if (!product?.inventory) return 0;
    return product.inventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Product not found</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-deep-indigo hover:text-royal-blue"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productImages = getDisplayImages();
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - getCurrentPrice()) / product.compareAtPrice) * 100)
    : 0;
  const availableColors = getAvailableColors();
  const stockCount = getStockCount();
  const currentPrice = getCurrentPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-deep-indigo">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-deep-indigo">Products</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link href={`/products?category=${product.category.slug}`} className="hover:text-deep-indigo">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left - Image Gallery (Amazon Style) */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="relative aspect-square bg-gray-100">
                {(() => {
                  const imageUrl = productImages[selectedImage] 
                    ? getImageUrl(productImages[selectedImage], product)
                    : '';
                  return imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={`${product.name} - Image ${selectedImage + 1}`}
                        className="w-full h-full object-contain cursor-zoom-in"
                        onClick={() => setImageZoom(!imageZoom)}
                      />
                      {imageZoom && (
                        <div 
                          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
                          onClick={() => setImageZoom(false)}
                        >
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <p className="text-lg mb-2">No Image Available</p>
                        <p className="text-sm">Image will be displayed here</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Image Navigation Arrows - More Prominent */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg z-10 border border-gray-200 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg z-10 border border-gray-200 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery - Below Main Image */}
            {productImages.length > 1 && (
              <div className="space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((img, index) => {
                    const imageUrl = getImageUrl(img, product);
                    return imageUrl ? (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-deep-indigo ring-2 ring-deep-indigo/20 scale-105'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Color Selection - Below Thumbnails */}
            {availableColors.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">Color:</span>
                  <span className="text-sm text-gray-600">{selectedColor || 'Select a color'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((variant) => {
                    const isSelected = selectedColor === variant.color;
                    // Color mapping for common colors
                    const colorMap: { [key: string]: string } = {
                      'red': '#EF4444',
                      'blue': '#3B82F6',
                      'green': '#10B981',
                      'yellow': '#F59E0B',
                      'purple': '#8B5CF6',
                      'pink': '#EC4899',
                      'black': '#1F2937',
                      'white': '#F3F4F6',
                      'orange': '#F97316',
                      'maroon': '#991B1B',
                      'navy': '#1E3A8A',
                      'gold': '#D4AF37',
                    };
                    const colorValue = colorMap[variant.color?.toLowerCase() || ''] || '#6B7280';
                    
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedColor(variant.color || null);
                          setSelectedVariant(variant.id);
                        }}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-deep-indigo ring-2 ring-deep-indigo/30 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: colorValue }}
                        title={variant.color}
                      >
                        {isSelected && (
                          <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right - Product Info (Amazon Style) */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating & Reviews */}
              {product._count?.reviews && product._count.reviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {product._count.reviews} ratings
                  </span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <span className="bg-sale-red text-white px-3 py-1 rounded text-sm font-bold">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              {product.compareAtPrice && (
                <p className="text-sm text-green-700 font-medium">
                  You save ₹{(product.compareAtPrice - currentPrice).toLocaleString()}!
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this item</h3>
                <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <span className="text-lg">−</span>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 text-center border border-gray-300 rounded-lg"
                  min="1"
                  max={stockCount}
                />
                <button
                  onClick={() => setQuantity(prev => Math.min(stockCount || 99, prev + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  disabled={quantity >= (stockCount || 99)}
                >
                  <span className="text-lg">+</span>
                </button>
                <span className="text-sm text-gray-600">({stockCount} available)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-deep-indigo hover:bg-navy-blue text-white py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-sale-red hover:bg-sale-red-light text-white py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
              <div className="flex gap-3">
                <button
                  onClick={toggleWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 border-2 rounded-lg transition-all ${
                    isInWishlist(product.id)
                      ? 'border-sale-red bg-red-50 text-sale-red'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 transition-all">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Delivery & Returns Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-deep-indigo mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">On orders over ₹5,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-deep-indigo mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% secure transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-deep-indigo mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Amazon Style) */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-12">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button className="px-6 py-4 font-semibold text-deep-indigo border-b-2 border-deep-indigo whitespace-nowrap">
                Product Details
              </button>
              <button className="px-6 py-4 font-medium text-gray-600 hover:text-deep-indigo whitespace-nowrap">
                Specifications
              </button>
              <button className="px-6 py-4 font-medium text-gray-600 hover:text-deep-indigo whitespace-nowrap">
                {product._count?.reviews && product._count.reviews > 0 
                  ? `Reviews (${product._count.reviews})`
                  : 'Reviews'
                }
              </button>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            {/* Product Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading text-gray-900 mb-4">Product Description</h2>
              {product.description ? (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              ) : product.shortDescription ? (
                <div className="text-gray-700 leading-relaxed">
                  {product.shortDescription}
                </div>
              ) : (
                <p className="text-gray-500 italic">No description available for this product.</p>
              )}
            </div>

            {/* Product Specifications */}
            <div>
              <h2 className="text-2xl font-heading text-gray-900 mb-6">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.category && (
                  <div className="flex">
                    <span className="w-40 text-gray-600 font-medium">Category:</span>
                    <span className="text-gray-900">{product.category.name}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex">
                    <span className="w-40 text-gray-600 font-medium">SKU:</span>
                    <span className="text-gray-900">{product.sku}</span>
                  </div>
                )}
                {product.barcode && (
                  <div className="flex">
                    <span className="w-40 text-gray-600 font-medium">Barcode:</span>
                    <span className="text-gray-900">{product.barcode}</span>
                  </div>
                )}
                {product.fabricType && (
                  <div className="flex">
                    <span className="w-40 text-gray-600 font-medium">Fabric Type:</span>
                    <span className="text-gray-900">{product.fabricType}</span>
                  </div>
                )}
                {product.sareeLength && (
                  <div className="flex">
                    <span className="w-40 text-gray-600 font-medium">Saree Length:</span>
                    <span className="text-gray-900">{product.sareeLength} meters</span>
                  </div>
                )}
                <div className="flex">
                  <span className="w-40 text-gray-600 font-medium">Blouse Included:</span>
                  <span className="text-gray-900">{product.blouseIncluded ? 'Yes' : 'No'}</span>
                </div>
                {stockCount > 0 && (
                  <div className="flex">
                    <span className="w-40 text-gray-600 font-medium">Stock:</span>
                    <span className="text-gray-900">{stockCount} units available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-deep-indigo/10 text-deep-indigo rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-gray-900 mb-6">
              Customers who viewed this item also viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedImageUrl = getImageUrl(relatedProduct.images?.[0], relatedProduct);
                const relatedDiscount = relatedProduct.compareAtPrice
                  ? Math.round(((relatedProduct.compareAtPrice - relatedProduct.basePrice) / relatedProduct.compareAtPrice) * 100)
                  : 0;
                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
                  >
                    <div className="aspect-[7/8] bg-gray-100 overflow-hidden relative">
                      {relatedImageUrl ? (
                        <img
                          src={relatedImageUrl}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      {relatedDiscount > 0 && (
                        <div className="absolute top-2 left-2 bg-sale-red text-white px-2 py-1 rounded text-xs font-bold">
                          {relatedDiscount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-sale-red">
                          ₹{relatedProduct.basePrice.toLocaleString()}
                        </span>
                        {relatedProduct.compareAtPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{relatedProduct.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
