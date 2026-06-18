import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const newsApi = {
  getByCategory: async (category = 'general', page = 1) => {
    const { data } = await axios.get(`${API_URL}/news/${category}?page=${page}`, {
      headers: getAuthHeader()
    });
    return data;
  },
  search: async (query, page = 1) => {
    const { data } = await axios.get(`${API_URL}/news/search/${encodeURIComponent(query)}?page=${page}`, {
      headers: getAuthHeader()
    });
    return data;
  }
};
