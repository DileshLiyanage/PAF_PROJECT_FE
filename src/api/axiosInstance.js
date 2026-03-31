import axios from 'axios';
import { getToken } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8089',
});

// Automatically attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
);

export default axiosInstance;