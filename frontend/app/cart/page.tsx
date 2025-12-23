'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart, user } = useStore();
  const router = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 100; // Free shipping over ₹5000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffef9] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="font-heading text-3xl text-[#312e81] mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#312e81] hover:bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffef9] py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl text-[#312e81] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 flex flex-col sm:flex-row gap-4 shadow-sm"
              >
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src="/images/placeholder.jpg"
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Product Name
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">Variant info here</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#312e81]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link
                href="/products"
                className="text-[#1e3a8a] hover:text-[#312e81] font-medium"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="font-heading text-2xl text-[#312e81] mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {subtotal < 5000 && (
                  <p className="text-sm text-[#d4af37]">
                    Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-[#312e81]">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#312e81] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-[#1e3a8a] hover:text-[#312e81] font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

