import api from '../api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data || [];
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },
};

