'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart, Share2, ArrowLeft } from 'lucide-react';
import { productsApi, Product } from '@/lib/api/products';
import { useStore } from '@/lib/store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productsApi.getBySlug(slug);
      
      // Debug: Log product data to see what images are in the database
      console.log('Product loaded:', {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        images: productData.images,
        imagesCount: productData.images?.length || 0,
      });
      
      setProduct(productData);
      
      // Load related products from the same category
      if (productData.category?.id) {
        const related = await productsApi.getAll({
          category: productData.category.id,
          limit: 4,
        });
        // Filter out current product and get up to 4 related products
        setRelatedProducts(
          related.products
            .filter(p => p.id !== productData.id && p.isActive)
            .slice(0, 4)
        );
      }
    } catch (error) {
      console.error('Error loading product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string | undefined, index: number = 0): string => {
    if (!image) {
      // Return placeholder if no image
      return '/images/placeholder.jpg';
    }
    
    // If it's already a full URL, return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // If it starts with /uploads, it's from the backend
    if (image.startsWith('/uploads')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      if (apiUrl.startsWith('http')) {
        // Development: extract base URL
        const baseUrl = apiUrl.replace('/api', '');
        return `${baseUrl}${image}`;
      }
      // Production: same domain, use image path directly
      return image;
    }
    
    // Old hardcoded paths like /images/products/... don't exist - use placeholder
    if (image.startsWith('/images/products/')) {
      return '/images/placeholder.jpg';
    }
    
    // If it starts with /, it might be a frontend public image
    if (image.startsWith('/')) {
      return image;
    }
    
    // Otherwise, return as is
    return image;
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
    addToCart({
      id: `product-${product.id}`,
      productId: product.id,
      quantity: 1,
      price: product.basePrice,
      productName: product.name,
      productImage: product.images?.[0] || '/images/placeholder.jpg',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-8">
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
      <div className="min-h-screen bg-soft-cream py-8">
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

  // Use actual product images, or show placeholder if none exist
  const productImages = product.images && product.images.length > 0
    ? product.images
    : ['/images/placeholder.jpg']; // Single placeholder if no images

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-deep-indigo mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Image Gallery */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-royal-blue'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(img, index)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const placeholder = '/images/placeholder.jpg';
                        if (!target.src.includes('placeholder')) {
                          target.src = placeholder;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 order-1 lg:order-2">
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={getImageUrl(productImages[selectedImage], selectedImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const placeholder = '/images/placeholder.jpg';
                    if (!target.src.includes('placeholder')) {
                      target.src = placeholder;
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.opacity = '1';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s' }}
                />
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-2xl md:text-3xl font-bold text-royal-blue">
                  ₹{product.basePrice.toLocaleString()}
                </p>
                {product.compareAtPrice && (
                  <>
                    <p className="text-xl text-gray-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </p>
                    {discount > 0 && (
                      <span className="bg-sale-red text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              {product.shortDescription && (
                <p className="text-gray-700 text-lg">{product.shortDescription}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="flex-1 bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Buy Now
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleWishlist}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isInWishlist(product.id)
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                <span>Wishlist</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
                <span>Share</span>
              </button>
            </div>

            {/* Product Description - Always Show */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-heading text-deep-indigo mb-4">Product Description</h2>
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
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-heading text-deep-indigo mb-4">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.category && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="text-gray-800 font-medium">{product.category.name}</p>
                  </div>
                )}
                {product.sku && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">SKU</p>
                    <p className="text-gray-800 font-medium">{product.sku}</p>
                  </div>
                )}
                {product.barcode && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Barcode</p>
                    <p className="text-gray-800 font-medium">{product.barcode}</p>
                  </div>
                )}
                {product.fabricType && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fabric Type</p>
                    <p className="text-gray-800 font-medium">{product.fabricType}</p>
                  </div>
                )}
                {product.sareeLength && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Saree Length</p>
                    <p className="text-gray-800 font-medium">{product.sareeLength} meters</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Blouse Included</p>
                  <p className="text-gray-800 font-medium">{product.blouseIncluded ? 'Yes' : 'No'}</p>
                </div>
                {product.inventory && product.inventory.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Stock Availability</p>
                    <p className="text-gray-800 font-medium">
                      {product.inventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0)} units available
                    </p>
                  </div>
                )}
                {product._count?.reviews !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Reviews</p>
                    <p className="text-gray-800 font-medium">{product._count.reviews} review(s)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-heading text-deep-indigo mb-4">Tags</h2>
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

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-heading text-deep-indigo mb-4">Available Variants</h2>
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-deep-indigo transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{variant.name}</p>
                          {variant.color && (
                            <p className="text-sm text-gray-600">Color: {variant.color}</p>
                          )}
                          {variant.fabric && (
                            <p className="text-sm text-gray-600">Fabric: {variant.fabric}</p>
                          )}
                          {variant.occasion && (
                            <p className="text-sm text-gray-600">Occasion: {variant.occasion}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">SKU: {variant.sku}</p>
                        </div>
                        {variant.price && (
                          <p className="text-lg font-bold text-royal-blue">
                            ₹{variant.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-6">
              Related Products
            </h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow min-w-[250px]"
                  >
                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img
                        src={getImageUrl(relatedProduct.images?.[0], 0)}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = getImageUrl(undefined, 0);
                          if (!target.src.includes('WhatsApp')) {
                            target.src = fallback;
                          }
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-deep-indigo">
                          ₹{relatedProduct.basePrice.toLocaleString()}
                        </p>
                        {relatedProduct.compareAtPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{relatedProduct.compareAtPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
