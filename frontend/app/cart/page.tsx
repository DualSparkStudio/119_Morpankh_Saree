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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  // Fetch product data for cart items that don't have slug or need updated images
  useEffect(() => {
    const fetchProductData = async () => {
      const itemsToUpdate: any[] = [];
      
      for (const item of cart) {
        // If item doesn't have slug or image, fetch product data
        if (!item.productSlug || !item.productImage) {
          try {
            const product = await productsApi.getById(item.productId);
            itemsToUpdate.push({
              ...item,
              productSlug: product.slug,
              productImage: product.images?.[0] || item.productImage || '',
              productName: product.name || item.productName,
            });
          } catch (error) {
            // If fetch fails, use existing item data
            itemsToUpdate.push(item);
          }
        } else {
          itemsToUpdate.push(item);
        }
      }
      
      setCartItemsWithData(itemsToUpdate);
    };

    if (cart.length > 0) {
      fetchProductData();
    } else {
      setCartItemsWithData([]);
    }
  }, [cart]);

  // Guest checkout is allowed - no need to check for user
  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Use cartItemsWithData if available, otherwise use cart
  const displayCart = cartItemsWithData.length > 0 ? cartItemsWithData : cart;

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
                      const imageUrl = item.productImage ? getImageUrl(item.productImage) : '';
                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.productName || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show placeholder
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="160"%3E%3Crect fill="%23f3f4f6" width="128" height="160"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
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

