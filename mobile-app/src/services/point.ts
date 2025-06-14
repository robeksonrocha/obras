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
      console.log('Registrando ponto:', { tipo });
      const response = await api.post<RegisterPointResponse>('/api/point/register', { tipo });
      console.log('Resposta do registro:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      throw new Error('Erro ao registrar ponto');
    }
  },

  getLastPoint: async (): Promise<LastPointResponse | null> => {
    try {
      console.log('Buscando último ponto...');
      const response = await api.get<LastPointResponse>('/api/point/last');
      console.log('Último ponto recebido:', response.data);
      
      // Validação básica da resposta
      if (!response.data) {
        console.log('Nenhum ponto encontrado');
        return null;
      }

      // Validação dos campos obrigatórios
      if (!response.data.tipo || !response.data.dataHora) {
        console.error('Resposta inválida do servidor:', response.data);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar último ponto:', error);
      return null;
    }
  },
}; 