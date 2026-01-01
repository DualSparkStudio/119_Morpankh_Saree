import api from '../api';

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  couponCode?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  createdAt: string;
}

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const { data: response } = await api.post('/orders', data);
    return response;
  },

  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data.orders || [];
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};

