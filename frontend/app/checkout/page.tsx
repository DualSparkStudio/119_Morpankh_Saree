'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { usersApi } from '@/lib/api/users';
import { paymentApi } from '@/lib/api/payment';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, clearCart } = useStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 100;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    loadAddresses();
  }, [user, cart]);

  const loadAddresses = async () => {
    try {
      const data = await usersApi.getAddresses();
      setAddresses(data);
      const defaultAddress = data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    if (!razorpayLoaded) {
      alert('Payment gateway is loading, please wait...');
      return;
    }

    try {
      setLoading(true);

      // Create order on backend first
      const selectedAddr = addresses.find(a => a.id === selectedAddress);
      if (!selectedAddr) return;

      // Create Razorpay order
      const orderResponse = await paymentApi.createRazorpayOrder({
        amount: Math.round(total),
        currency: 'INR',
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Morpankh Saree',
        description: 'Order Payment',
        order_id: orderResponse.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Clear cart and redirect to success page
            clearCart();
            router.push('/order-success');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#312e81',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        alert('Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error initiating payment. Please try again.');
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <div className="min-h-screen bg-[#fffef9] py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl text-[#312e81] mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-heading text-2xl text-[#312e81] mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? 'border-[#312e81] bg-[#312e81]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-semibold text-gray-800 mb-1">
                          {address.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                          <br />
                          Phone: {address.phone}
                        </div>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => router.push('/account/addresses?new=true')}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-[#1e3a8a] hover:border-[#312e81] hover:bg-gray-50 transition-colors"
                  >
                    + Add New Address
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-heading text-2xl text-[#312e81] mb-4">Payment Method</h2>
                <div className="border-2 border-[#312e81] bg-[#312e81]/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#312e81] rounded-lg flex items-center justify-center text-white font-bold">
                      R
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Razorpay</div>
                      <div className="text-sm text-gray-600">
                        Cards, UPI, Netbanking, Wallets
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="font-heading text-2xl text-[#312e81] mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
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
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-[#312e81]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || !selectedAddress}
                  className="w-full bg-[#312e81] hover:bg-[#1e3a8a] text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your personal data will be used to process your order and support your experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

