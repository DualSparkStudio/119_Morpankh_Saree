import api from '../api';

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    role: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: {
    email?: string;
    phone?: string;
    password?: string;
    name?: string;
  }): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    // Clear tokens locally (API doesn't need logout endpoint for JWT)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
};

