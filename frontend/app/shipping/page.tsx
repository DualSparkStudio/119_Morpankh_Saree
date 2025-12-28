import { Truck, Clock, Shield, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-deep-indigo mb-12 text-center">Shipping Information</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-heading text-deep-indigo mb-6">Shipping Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We offer fast and secure shipping across India to ensure your precious sarees reach you safely and on time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Delivery Time</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Standard shipping takes 3-7 business days across India. Express shipping (1-2 days) is available for select locations at an additional charge.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Processing Time</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Orders are typically processed within 1-2 business days. You will receive a confirmation email once your order has been shipped.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Packaging</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All products are carefully packed in premium packaging to ensure they arrive in perfect condition. We use protective materials and secure boxes.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading text-deep-indigo">Shipping Locations</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We currently ship to all major cities and towns across India. International shipping will be available soon.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-6">Shipping Charges</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Standard Shipping</span>
                <span className="text-deep-indigo font-semibold">Free (Orders above ₹2,000)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Standard Shipping</span>
                <span className="text-deep-indigo font-semibold">₹100 (Orders below ₹2,000)</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-medium">Express Shipping</span>
                <span className="text-deep-indigo font-semibold">₹300</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mt-8">
            <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-4">Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once your order is shipped, you will receive a tracking number via email and SMS. You can use this tracking number to track your order status on our website or the courier company's website.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about your shipment, please contact our customer service team at support@morpankhsaree.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
