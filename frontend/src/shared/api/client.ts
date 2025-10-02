import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  withCredentials: true, // Important for sending cookies
});

// Logging interceptor for requests and responses
api.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    withCredentials: config.withCredentials,
  });
  return config;
});

// Simple error handling and logging
api.interceptors.response.use(
  (res) => {
    console.log('API Response:', {
      url: res.config.url,
      status: res.status,
      data: res.data,
    });
    return res;
  },
  (err) => {
    console.log('API Error:', {
      url: err.config?.url,
      status: err.response?.status,
      message: err.response?.data?.message || err.message,
    });
    const message =
      err?.response?.data?.message || err.message || 'Request error';
    return Promise.reject(new Error(message));
  }
);

export default api;
