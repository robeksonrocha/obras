import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do endereço base da API dependendo da plataforma
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  // iOS
  return 'http://localhost:8080';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Função auxiliar para validar o formato do token JWT
const isValidJWT = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Verifica se as partes do token são Base64 válido
    parts.forEach(part => {
      const padding = '='.repeat((4 - part.length % 4) % 4);
      const base64 = (part + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      window.atob(base64);
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Interceptor para logs de requisição
api.interceptors.request.use(
  async (config) => {
    // Log da requisição
    console.log('Requisição:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    const token = await AsyncStorage.getItem('@PontoEletronico:token');
    
    // Verifica se é uma rota que não precisa de token (como login)
    const isAuthRoute = config.url?.includes('/auth/login');
    
    if (!isAuthRoute && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    // Log da resposta
    console.log('Resposta:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Remove o token inválido
      AsyncStorage.removeItem('@PontoEletronico:token');
    }
    
    return Promise.reject(error);
  }
);

export default api; 