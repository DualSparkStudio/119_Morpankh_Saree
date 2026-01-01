'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { usersApi } from '@/lib/api/users';
import { paymentApi } from '@/lib/api/payment';
import { ordersApi } from '@/lib/api/orders';
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

interface GuestAddress {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, clearCart, _hasHydrated } = useStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [userWantsGuestCheckout, setUserWantsGuestCheckout] = useState(false); // Only for logged-in users
  const [guestAddress, setGuestAddress] = useState<GuestAddress>({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  // Derived state: guest checkout is true if no user OR if logged-in user chose guest mode
  // This is computed from current state, not stored in useState to avoid sync issues
  const isGuestCheckout = !user || userWantsGuestCheckout;

  useEffect(() => {
    // Wait for store to hydrate before making decisions
    // This prevents showing incorrect UI state before we know if user is logged in
    if (!_hasHydrated) {
      return;
    }

    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Reset guest checkout preference when user logs out
    // This ensures clean state when switching from logged-in to guest
    if (!user) {
      setUserWantsGuestCheckout(false);
    }

    // Load addresses only if user is logged in and NOT using guest checkout
    if (user && !isGuestCheckout) {
      loadAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cart.length, isGuestCheckout, _hasHydrated]);

  // Show loading while store hydrates
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-soft-cream py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

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

  const validateGuestForm = (): boolean => {
    if (!guestAddress.name || !guestAddress.email || !guestAddress.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return false;
    }
    if (!guestAddress.addressLine1 || !guestAddress.city || !guestAddress.state || !guestAddress.pincode) {
      alert('Please fill in all address fields');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestAddress.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    // Basic phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(guestAddress.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading, please wait...');
      return;
    }

    // Validate guest form if guest checkout
    if (isGuestCheckout) {
      if (!validateGuestForm()) {
        return;
      }
    } else {
      if (!selectedAddress) {
        alert('Please select a shipping address');
        return;
      }
    }

    try {
      setLoading(true);
      console.log('Starting payment process...', { isGuestCheckout, user: !!user });

      // Prepare shipping address
      let shippingAddr: any;
      if (isGuestCheckout) {
        shippingAddr = {
          name: guestAddress.name,
          phone: guestAddress.phone,
          addressLine1: guestAddress.addressLine1,
          addressLine2: guestAddress.addressLine2 || '',
          city: guestAddress.city,
          state: guestAddress.state,
          pincode: guestAddress.pincode,
          country: 'India',
        };
      } else {
        const selectedAddr = addresses.find(a => a.id === selectedAddress);
        if (!selectedAddr) {
          setLoading(false);
          return;
        }
        shippingAddr = {
          name: selectedAddr.name,
          phone: selectedAddr.phone,
          addressLine1: selectedAddr.addressLine1,
          addressLine2: selectedAddr.addressLine2 || '',
          city: selectedAddr.city,
          state: selectedAddr.state,
          pincode: selectedAddr.pincode,
          country: 'India',
        };
      }

      // Prepare order items
      const orderItems = cart.map((item) => {
        const orderItem: any = {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        };
        // Only include variantId if it exists and is not empty
        if (item.variantId && typeof item.variantId === 'string' && item.variantId.trim() !== '') {
          orderItem.variantId = item.variantId;
        }
        return orderItem;
      });

      // Create order on backend
      const orderData: any = {
        items: orderItems,
        shippingAddress: shippingAddr,
        billingAddress: shippingAddr, // Using same address for billing
      };

      // Add guest information if guest checkout
      if (isGuestCheckout) {
        orderData.guestName = guestAddress.name;
        orderData.guestEmail = guestAddress.email;
        orderData.guestPhone = guestAddress.phone;
      }

      // Create order on backend
      let order;
      try {
        order = await ordersApi.createOrder(orderData);
      } catch (orderError: any) {
        console.error('Order creation error:', orderError);
        throw new Error(orderError?.response?.data?.message || 'Failed to create order. Please try again.');
      }

      // Create Razorpay order
      const orderResponse = await paymentApi.createRazorpayOrder({
        amount: Math.round(total),
        currency: 'INR',
        orderId: order.id,
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
          name: isGuestCheckout ? guestAddress.name : (user?.name || ''),
          email: isGuestCheckout ? guestAddress.email : (user?.email || ''),
          contact: isGuestCheckout ? guestAddress.phone : (user?.phone || ''),
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
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error?.response?.data?.message || 'Error initiating payment. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <div className="min-h-screen bg-soft-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Billing Form */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-heading text-deep-indigo mb-6">Billing Details</h2>
                  
                  {/* Guest/User Toggle - Only show if user is logged in AND store has hydrated */}
                  {user && _hasHydrated && (
                    <div className="mb-6">
                      <button
                        onClick={() => setUserWantsGuestCheckout(!userWantsGuestCheckout)}
                        className="text-sm text-deep-indigo hover:underline"
                      >
                        {userWantsGuestCheckout ? 'Use saved address' : 'Checkout as guest'}
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {isGuestCheckout ? (
                      <div className="space-y-4">
                        {/* Guest Checkout Form - Only show heading if user is logged in (otherwise it's obvious they're a guest) */}
                        {user && _hasHydrated && (
                          <h3 className="text-xl font-heading text-deep-indigo mb-4">Contact Information</h3>
                        )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={guestAddress.name}
                        onChange={(e) => setGuestAddress({ ...guestAddress, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={guestAddress.email}
                        onChange={(e) => setGuestAddress({ ...guestAddress, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={guestAddress.phone}
                        onChange={(e) => setGuestAddress({ ...guestAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                        maxLength={10}
                        required
                      />
                    </div>
                    <h3 className="text-xl font-heading text-deep-indigo mb-4 mt-6">Shipping Address</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={guestAddress.addressLine1}
                        onChange={(e) => setGuestAddress({ ...guestAddress, addressLine1: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={guestAddress.addressLine2}
                        onChange={(e) => setGuestAddress({ ...guestAddress, addressLine2: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={guestAddress.city}
                          onChange={(e) => setGuestAddress({ ...guestAddress, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={guestAddress.state}
                          onChange={(e) => setGuestAddress({ ...guestAddress, state: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={guestAddress.pincode}
                        onChange={(e) => setGuestAddress({ ...guestAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-transparent"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-heading text-deep-indigo mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress === address.id
                              ? 'border-deep-indigo bg-deep-indigo/5'
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
                        onClick={() => router.push('/profile?newAddress=true')}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-deep-indigo hover:border-deep-indigo hover:bg-gray-50 transition-colors"
                      >
                        + Add New Address
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h2 className="text-xl font-heading text-deep-indigo mb-4">Payment Method</h2>
                <div className="border-2 border-deep-indigo bg-deep-indigo/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-deep-indigo rounded-lg flex items-center justify-center text-white font-bold">
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

            {/* Right - Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow-md h-fit">
              <h2 className="text-2xl font-heading text-deep-indigo mb-6">Order Summary</h2>
                
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">{item.productName || 'Product'}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-deep-indigo">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xl font-bold text-deep-indigo pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || (!isGuestCheckout && !selectedAddress)}
                className="w-full bg-royal-blue hover:bg-deep-indigo text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your personal data will be used to process your order and support your experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
