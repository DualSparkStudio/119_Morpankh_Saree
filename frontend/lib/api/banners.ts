import api from '../api';

export interface Banner {
  id: string;
  title?: string;
  description?: string;
  image: string;
  link?: string;
  linkText?: string;
  position: string;
  order: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export const bannersApi = {
  // Public API - get banners
  getBanners: async (position?: string): Promise<Banner[]> => {
    const { data } = await api.get('/banners', { params: position ? { position } : {} });
    return data;
  },
  // Alias for compatibility
  getAll: async (position?: string): Promise<Banner[]> => {
    return bannersApi.getBanners(position);
  },

  // Admin API - get all banners
  getAdminBanners: async (): Promise<Banner[]> => {
    const { data } = await api.get('/admin/banners');
    return data;
  },

  // Admin API - get banner by ID
  getBannerById: async (id: string): Promise<Banner> => {
    const { data } = await api.get(`/admin/banners/${id}`);
    return data;
  },

  // Admin API - create banner
  createBanner: async (bannerData: FormData): Promise<Banner> => {
    const { data } = await api.post('/admin/banners', bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Admin API - update banner
  updateBanner: async (id: string, bannerData: FormData): Promise<Banner> => {
    const { data } = await api.put(`/admin/banners/${id}`, bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Admin API - delete banner
  deleteBanner: async (id: string): Promise<void> => {
    await api.delete(`/admin/banners/${id}`);
  },
};
