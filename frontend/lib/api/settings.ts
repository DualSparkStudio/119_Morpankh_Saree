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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/settings`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return response.json();
  },

  // Update a setting (admin only)
  update: async (key: string, value: number | string | boolean): Promise<Setting> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/settings/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update setting');
    }
    return response.json();
  },
};

