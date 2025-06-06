import api from './api';

export interface Obra {
  id?: number;
  nome: string;
  endereco: string;
  cliente: string;
  dataInicio: string;
  dataPrevisaoFim: string;
  dataConclusao?: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA' | 'CANCELADA';
  latitude: number;
  longitude: number;
  raioPermitido: number;
}

export const obraService = {
  listarTodas: async (): Promise<Obra[]> => {
    const response = await api.get<Obra[]>('/obras');
    return response.data;
  },

  listarAtivas: async (): Promise<Obra[]> => {
    const response = await api.get<Obra[]>('/obras/ativas');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Obra> => {
    const response = await api.get<Obra>(`/obras/${id}`);
    return response.data;
  },

  criar: async (obra: Obra): Promise<Obra> => {
    const response = await api.post<Obra>('/obras', obra);
    return response.data;
  },

  atualizar: async (id: number, obra: Obra): Promise<Obra> => {
    const response = await api.put<Obra>(`/obras/${id}`, obra);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/obras/${id}`);
  }
}; 