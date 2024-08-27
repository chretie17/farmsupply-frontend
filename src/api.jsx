import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Set up the Axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
