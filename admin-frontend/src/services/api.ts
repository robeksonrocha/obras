import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.warn('[API] Status do erro:', error.response.status, error.response.statusText);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';
      // Apenas loga o erro por enquanto
      console.warn('[API] Erro de autenticação:', error.response?.status, error.response?.statusText);
    }
    return Promise.reject(error);
  }
);

export default api; 