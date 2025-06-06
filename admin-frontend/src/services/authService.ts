import api from './api';

export interface LoginCredentials {
    email: string;
    senha: string;
}

export interface Usuario {
    id?: number;
    email: string;
    senha?: string;
    nome: string;
    role: 'ADMIN' | 'GESTOR' | 'USUARIO';
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<string> => {
        const response = await api.post<{ token: string }>('/auth/login', credentials);
        const { token } = response.data;
        localStorage.setItem('token', token);
        return token;
    },

    registrar: async (usuario: Usuario): Promise<Usuario> => {
        const response = await api.post<Usuario>('/auth/registrar', usuario);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
}; 