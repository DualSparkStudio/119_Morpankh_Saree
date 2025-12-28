'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useStore();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    // This would load wishlist items from API in real implementation
    // For now, showing empty state if wishlist is empty
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-soft-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">My Wishlist</h1>
          
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-heading text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding items you love!</p>
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
        <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">My Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-heading text-gray-700 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Start adding items you love!</p>
              <Link
                href="/products"
                className="inline-block bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Link href={`/products/${item.id}`}>
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-deep-indigo">₹{item.price?.toLocaleString()}</p>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

