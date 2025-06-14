import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do endereço base da API dependendo da plataforma
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8080/api';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  // iOS
  return 'http://localhost:8080/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@PontoEletronico:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 