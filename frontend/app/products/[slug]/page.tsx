'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Minus, Plus, Star, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { productsApi, Product } from '@/lib/api/products';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const { wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getBySlug(slug);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0].id);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (wishlist.includes(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: `${product.id}-${selectedVariant || 'default'}`,
      productId: product.id,
      variantId: selectedVariant || undefined,
      quantity,
      price: product.basePrice,
    });
  };

  const incrementQuantity = () => {
    const maxQuantity = product?.inventory?.reduce((sum, inv) => sum + inv.quantity, 0) || 10;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#312e81]"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const availableQuantity = product.inventory?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
  const inStock = availableQuantity > 0;

  return (
    <div className="min-h-screen bg-[#fffef9] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
              <Image
                src={product.images[selectedImageIndex] || product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-[#312e81]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <p className="text-sm text-[#1e3a8a] mb-2">{product.category.name}</p>
            )}
            <h1 className="font-heading text-4xl md:text-5xl text-[#312e81] mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[#312e81]">
                ₹{product.basePrice.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                    {Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">In Stock ({availableQuantity} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        selectedVariant === variant.id
                          ? 'border-[#312e81] bg-[#312e81] text-white'
                          : 'border-gray-300 hover:border-[#1e3a8a]'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= availableQuantity}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {availableQuantity} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-[#312e81] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  wishlist.includes(product.id)
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-[#312e81] hover:text-[#312e81]'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="font-heading text-2xl text-[#312e81] mb-4">Description</h2>
                <div
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Reviews Summary */}
            {product._count && product._count.reviews > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="font-heading text-2xl text-[#312e81] mb-4">Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-[#d4af37] text-[#d4af37]"
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({product._count.reviews} review{product._count.reviews !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

