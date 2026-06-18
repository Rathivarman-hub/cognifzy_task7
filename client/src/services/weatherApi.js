import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const weatherApi = {
  getByCity: async (city) => {
    const { data } = await axios.get(`${API_URL}/weather/${encodeURIComponent(city)}`, {
      headers: getAuthHeader()
    });
    return data;
  },
  getByCoords: async (lat, lon) => {
    const { data } = await axios.get(`${API_URL}/weather/coords/${lat}/${lon}`, {
      headers: getAuthHeader()
    });
    return data;
  }
};
