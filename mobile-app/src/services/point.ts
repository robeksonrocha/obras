import { api } from './auth';

export type PointType = 'ENTRADA' | 'SAIDA_ALMOCO' | 'RETORNO_ALMOCO' | 'SAIDA';

interface RegisterPointResponse {
  id: number;
  type: PointType;
  timestamp: string;
}

interface LastPointResponse {
  tipo: PointType;
  dataHora: string;
}

export const pointService = {
  register: async (tipo: PointType): Promise<RegisterPointResponse> => {
    try {
      const response = await api.post<RegisterPointResponse>('/api/point/register', { tipo });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao registrar ponto');
    }
  },

  getLastPoint: async (): Promise<LastPointResponse | null> => {
    try {
      const response = await api.get<LastPointResponse>('/api/point/last');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar último ponto:', error);
      return null;
    }
  },
}; 