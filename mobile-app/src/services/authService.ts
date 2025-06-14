import api from './api';
import { AuthResponse, LoginData } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  
  if (response.data.token) {
    await AsyncStorage.setItem('@PontoEletronico:token', response.data.token);
    await AsyncStorage.setItem('@PontoEletronico:usuario', JSON.stringify(response.data.usuario));
  }
  
  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('@PontoEletronico:token');
  await AsyncStorage.removeItem('@PontoEletronico:usuario');
};

export const getUsuarioLogado = async () => {
  const usuarioString = await AsyncStorage.getItem('@PontoEletronico:usuario');
  return usuarioString ? JSON.parse(usuarioString) : null;
}; 