'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils/imageHelper';
import { productsApi } from '@/lib/api/products';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart, user } = useStore();
  const router = useRouter();
  const [cartItemsWithData, setCartItemsWithData] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  // Fetch product data only for items that need it (missing slug or image)
  useEffect(() => {
    const fetchProductData = async () => {
      // Find items that need data fetching (missing slug or image)
      const itemsNeedingData = cart.filter(item => !item.productSlug || !item.productImage);
      
      if (itemsNeedingData.length === 0) {
        // All items have data, use cart directly
        setCartItemsWithData(cart);
        setLoadingImages(false);
        return;
      }

      setLoadingImages(true);
      
      try {
        // Fetch all product data in parallel for better performance
        const productPromises = itemsNeedingData.map(item =>
          productsApi.getById(item.productId).catch(() => null)
        );
        
        const products = await Promise.all(productPromises);
        
        // Create a map of productId to product data for quick lookup
        const productMap = new Map();
        itemsNeedingData.forEach((item, index) => {
          if (products[index]) {
            productMap.set(item.productId, products[index]);
          }
        });
        
        // Update items with fetched data
        const itemsToUpdate = cart.map(item => {
          const product = productMap.get(item.productId);
          if (!product) return item;
          
          // Get the first valid image
          let productImage = '';
          if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            for (const img of product.images) {
              if (img && typeof img === 'string' && img.trim() !== '') {
                productImage = img;
                break;
              }
            }
          }
          
          // Fallback to existing if no image found
          if (!productImage && item.productImage && typeof item.productImage === 'string' && item.productImage.trim() !== '') {
            productImage = item.productImage;
          }
          
          return {
            ...item,
            productSlug: product.slug || item.productSlug || item.productId,
            productImage: productImage || item.productImage || '',
            productName: product.name || item.productName,
          };
        });
        
        setCartItemsWithData(itemsToUpdate);
      } catch (error) {
        console.error('Error fetching product data:', error);
        // On error, use cart data as-is
        setCartItemsWithData(cart);
      } finally {
        setLoadingImages(false);
      }
    };

    if (cart.length > 0) {
      fetchProductData();
    } else {
      setCartItemsWithData([]);
      setLoadingImages(false);
    }
  }, [cart]);

  // Guest checkout is allowed - no need to check for user
  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Use cartItemsWithData if available and loaded, otherwise use cart
  const displayCart = !loadingImages && cartItemsWithData.length > 0 ? cartItemsWithData : cart;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-heading text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart!</p>
            <Link
              href="/products"
              className="inline-block bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {displayCart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
              >
                <Link href={`/products/${item.productSlug || item.productId}`} className="flex-shrink-0">
                  <div className="w-24 h-32 sm:w-32 sm:h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {(() => {
                      // Get image URL - handle both string and array formats
                      let imagePath = item.productImage;
                      
                      // If productImage is a string and not empty, use it
                      if (typeof imagePath === 'string' && imagePath.trim() !== '') {
                        const imageUrl = getImageUrl(imagePath);
                        if (imageUrl && imageUrl.trim() !== '') {
                          return (
                            <img
                              src={imageUrl}
                              alt={item.productName || 'Product'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                console.error('Image failed to load:', imageUrl, 'Original path:', imagePath);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                // Show placeholder if image fails
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.image-placeholder')) {
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'image-placeholder w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs';
                                  placeholder.textContent = 'Image not found';
                                  parent.appendChild(placeholder);
                                }
                              }}
                              onLoad={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.opacity = '1';
                              }}
                              style={{ opacity: 0, transition: 'opacity 0.3s' }}
                            />
                          );
                        }
                      }
                      
                      // No valid image URL - show placeholder
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                          No Image
                        </div>
                      );
                    })()}
                  </div>
                </Link>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/products/${item.productSlug || item.productId}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 hover:text-royal-blue">{item.productName || 'Product Name'}</h3>
                    </Link>
                    <p className="text-lg font-bold text-deep-indigo">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-heading text-deep-indigo mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xl font-bold text-deep-indigo">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

