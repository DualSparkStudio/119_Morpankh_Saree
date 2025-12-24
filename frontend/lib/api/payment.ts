import api from '../api';

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const paymentApi = {
  createRazorpayOrder: async (data: {
    amount: number;
    currency?: string;
    orderId?: string;
  }): Promise<RazorpayOrderResponse> => {
    const { data: response } = await api.post('/payments/razorpay/create-order', data);
    return response;
  },

  verifyPayment: async (data: PaymentVerificationRequest) => {
    const { data: response } = await api.post('/payments/razorpay/verify', data);
    return response;
  },

  getPaymentStatus: async (orderId: string) => {
    const { data } = await api.get(`/payments/${orderId}/status`);
    return data;
  },
};

