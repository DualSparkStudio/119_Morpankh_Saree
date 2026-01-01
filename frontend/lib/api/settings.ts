const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Setting {
  key: string;
  value: number | string | boolean;
}

export const settingsApi = {
  // Get a setting by key (public endpoint)
  get: async (key: string): Promise<Setting> => {
    const response = await fetch(`${API_URL}/settings/${key}`);
    if (!response.ok) {
      if (response.status === 404) {
        // Return default for tax_percentage if not found
        if (key === 'tax_percentage') {
          return { key, value: 0 };
        }
      }
      throw new Error('Failed to fetch setting');
    }
    return response.json();
  },

  // Get all settings (admin only)
  getAll: async (): Promise<Setting[]> => {
    // Use the centralized API client which handles auth tokens properly
    const { api } = await import('../api');
    const { data } = await api.get('/settings');
    return data;
  },

  // Update a setting (admin only)
  update: async (key: string, value: number | string | boolean): Promise<Setting> => {
    // Use the centralized API client which handles auth tokens properly
    const { api } = await import('../api');
    const { data } = await api.put(`/settings/${key}`, { value });
    return data;
  },
};

