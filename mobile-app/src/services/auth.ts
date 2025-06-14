import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  usuario: {
    nome: string;
    email: string;
    role: string;
  };
}

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

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Iniciando tentativa de login:', {
        credentials: {
          email: credentials.email,
          senha: '***'
        }
      });

      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      
      console.log('Login bem-sucedido:', {
        status: response.status,
        data: response.data
      });

      // Verifica se o token está presente na resposta
      if (!response.data || !response.data.token) {
        throw new Error('Token não recebido do servidor');
      }

      // Verifica se o token é um JWT válido
      if (!isValidJWT(response.data.token)) {
        throw new Error('Token JWT inválido recebido do servidor');
      }

      // Salva o token e os dados do usuário no AsyncStorage
      await AsyncStorage.setItem('@PontoEletronico:token', response.data.token);
      
      // Verifica se os dados do usuário são válidos antes de salvar
      if (response.data.usuario && 
          typeof response.data.usuario === 'object' && 
          response.data.usuario.nome) {
        await AsyncStorage.setItem('@PontoEletronico:usuario', JSON.stringify(response.data.usuario));
      } else {
        console.warn('Dados do usuário ausentes ou inválidos na resposta do login');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Email ou senha inválidos');
        }
        if (error.response.status === 404) {
          throw new Error('Servidor não encontrado. Verifique se o backend está rodando.');
        }
        throw new Error(error.response.data?.message || 'Erro ao fazer login');
      }
      
      if (!error.response) {
        throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      }
      
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('@PontoEletronico:token');
    await AsyncStorage.removeItem('@PontoEletronico:usuario');
  },

  getToken: async () => {
    return await AsyncStorage.getItem('@PontoEletronico:token');
  },

  getUsuario: async () => {
    try {
      const usuarioString = await AsyncStorage.getItem('@PontoEletronico:usuario');
      
      // Retorna null se o valor for null, undefined ou a string "undefined"
      if (!usuarioString || usuarioString === "undefined" || usuarioString === "null") {
        return null;
      }

      const usuario = JSON.parse(usuarioString);
      
      // Verifica se o objeto do usuário tem a estrutura esperada
      if (!usuario || typeof usuario !== 'object' || !usuario.nome) {
        console.warn('Dados do usuário inválidos no AsyncStorage');
        await AsyncStorage.removeItem('@PontoEletronico:usuario');
        return null;
      }
      
      return usuario;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      // Em caso de erro, remove os dados inválidos
      await AsyncStorage.removeItem('@PontoEletronico:usuario');
      return null;
    }
  }
}; 