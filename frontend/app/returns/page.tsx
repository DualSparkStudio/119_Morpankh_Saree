import { RotateCcw, Clock, Package, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-deep-indigo mb-12 text-center">Returns Policy</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, we accept returns within 7 days of delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Return Window</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Returns must be initiated within 7 days of delivery. Items must be unused, unworn, and in their original condition with all tags attached.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Return Condition</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Items must be returned in original packaging with all tags, labels, and accessories intact. Products should not show signs of wear or use.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">How to Return</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Contact our customer service team at support@morpankhsaree.com or call us to initiate a return. We will provide you with a return authorization and shipping instructions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-sale-red rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Non-Returnable Items</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Personalized or customized items, items without original tags, and items damaged due to customer misuse are not eligible for return.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-6">Refund Process</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-royal-blue text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Initiate Return</h4>
                  <p className="text-gray-700">Contact us within 7 days of delivery to start the return process.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-royal-blue text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ship Back</h4>
                  <p className="text-gray-700">Pack the item in its original packaging and ship it back using the provided return label.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-royal-blue text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Quality Check</h4>
                  <p className="text-gray-700">We will inspect the returned item to ensure it meets our return conditions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-royal-blue text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Refund Processed</h4>
                  <p className="text-gray-700">Once approved, refund will be processed to your original payment method within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-4">Exchange Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer exchanges for different sizes or colors, subject to availability. The same return conditions and timeframes apply.
            </p>
            <p className="text-gray-700 leading-relaxed">
              To exchange an item, please contact our customer service team within 7 days of delivery. If the exchanged item has a different price, we will process the price difference accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
