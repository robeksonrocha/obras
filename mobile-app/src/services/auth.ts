import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração da API
const API_URL = 'http://localhost:8080';

// Interfaces
interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
}

// Criação da instância do axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@auth:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    console.log('Resposta da API:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Erro na API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Iniciando tentativa de login:', {
        url: `${API_URL}/api/auth/login`,
        credentials: {
          email: credentials.email,
          senha: '***'
        }
      });

      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      
      console.log('Login bem-sucedido:', {
        status: response.status,
        headers: response.headers
      });

      // Salva o token no AsyncStorage
      await AsyncStorage.setItem('@auth:token', response.data.token);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Detalhes do erro:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });

        if (error.response?.status === 401) {
          throw new Error('Email ou senha inválidos');
        }
        if (error.response?.status === 404) {
          throw new Error(`Servidor não encontrado. URL: ${API_URL}/api/auth/login`);
        }
        if (!error.response) {
          throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
        }
        throw new Error(error.response?.data?.message || `Erro ao fazer login: ${error.message}`);
      }
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('@auth:token');
  },

  getToken: async () => {
    return await AsyncStorage.getItem('@auth:token');
  }
}; 