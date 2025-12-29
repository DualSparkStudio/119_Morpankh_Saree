import api from '../api';

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  fabric?: string;
  occasion?: string;
  price?: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  images: string[];
  fabricType?: string;
  sareeLength?: number;
  blouseIncluded?: boolean;
  tags?: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
  inventory?: Array<{
    id?: string;
    type: string;
    quantity: number;
    reserved?: number;
  }>;
  _count?: {
    reviews: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<ProductsResponse> => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  getFeatured: async (limit: number = 8): Promise<Product[]> => {
    const { data } = await api.get('/products', {
      params: { limit, sort: 'createdAt', order: 'desc' },
    });
    return data.products || [];
  },
};

