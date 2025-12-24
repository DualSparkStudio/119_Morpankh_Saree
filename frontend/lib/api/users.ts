import api from '../api';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export const usersApi = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (profile: { name?: string; email?: string; phone?: string }) => {
    const { data } = await api.put('/users/profile', profile);
    return data;
  },

  getAddresses: async (): Promise<Address[]> => {
    const { data } = await api.get('/users/addresses');
    return data;
  },

  addAddress: async (address: Omit<Address, 'id'>) => {
    const { data } = await api.post('/users/addresses', address);
    return data;
  },

  updateAddress: async (id: string, address: Partial<Address>) => {
    const { data } = await api.put(`/users/addresses/${id}`, address);
    return data;
  },

  deleteAddress: async (id: string) => {
    await api.delete(`/users/addresses/${id}`);
  },
};

