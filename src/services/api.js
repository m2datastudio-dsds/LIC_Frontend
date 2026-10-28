import axios from 'axios';

const configuredUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_BASE_URL = configuredUrl.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function createAuthenticatedApi(token) {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export default api;
