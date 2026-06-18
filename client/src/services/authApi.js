import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: API_URL });

export const authApi = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },
  getProfile: async (token) => {
    const { data } = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
  githubLogin: () => {
    window.location.href = `${API_URL}/auth/github`;
  }
};
