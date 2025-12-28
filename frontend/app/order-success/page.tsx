import Link from 'next/link';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-5xl text-deep-indigo mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-6 h-6 text-royal-blue" />
              <h2 className="text-xl font-heading text-deep-indigo">Order Confirmation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              You will receive an order confirmation email shortly with all the details.
            </p>
            <p className="text-gray-700">
              Order Number: <span className="font-semibold text-deep-indigo">#ORD-12345</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 bg-royal-blue hover:bg-deep-indigo text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              View Orders
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border-2 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
