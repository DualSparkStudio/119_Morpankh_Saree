import api from './api';
import { Product } from './products';

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/dashboard/stats');
    return data;
  },

  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ products: Product[]; pagination: any }> => {
    const { data } = await api.get('/admin/products', { params });
    return data;
  },

  createProduct: async (productData: any): Promise<Product> => {
    const { data } = await api.post('/admin/products', productData);
    return data;
  },

  updateProduct: async (id: string, productData: any): Promise<Product> => {
    const { data } = await api.put(`/admin/products/${id}`, productData);
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: any[]; pagination: any }> => {
    const { data } = await api.get('/admin/orders', { params });
    return data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<any> => {
    const { data } = await api.patch(`/admin/orders/${id}/status`, { status });
    return data;
  },
};

