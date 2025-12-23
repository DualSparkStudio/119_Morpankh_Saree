import api from './api';

export interface Banner {
  id: string;
  title?: string;
  description?: string;
  image: string;
  link?: string;
  linkText?: string;
  position: string;
}

export const bannersApi = {
  getAll: async (position?: string): Promise<Banner[]> => {
    const { data } = await api.get('/banners', {
      params: position ? { position } : {},
    });
    return data || [];
  },
};

