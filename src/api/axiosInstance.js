import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// attach token if present
instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  return cfg;
}, err => Promise.reject(err));

export default instance;
