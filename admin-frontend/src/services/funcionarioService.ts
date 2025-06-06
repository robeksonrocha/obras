import api from './api';

export interface Funcionario {
  id?: number;
  nome: string;
  cpf: string;
  cargo: string;
  dataAdmissao: string;
  telefone: string;
  email: string;
  ativo: boolean;
}

export const funcionarioService = {
  listarTodos: async (): Promise<Funcionario[]> => {
    const response = await api.get<Funcionario[]>('/funcionarios');
    return response.data;
  },

  listarAtivos: async (): Promise<Funcionario[]> => {
    const response = await api.get<Funcionario[]>('/funcionarios/ativos');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Funcionario> => {
    const response = await api.get<Funcionario>(`/funcionarios/${id}`);
    return response.data;
  },

  criar: async (funcionario: Funcionario): Promise<Funcionario> => {
    const response = await api.post<Funcionario>('/funcionarios', funcionario);
    return response.data;
  },

  atualizar: async (id: number, funcionario: Funcionario): Promise<Funcionario> => {
    const response = await api.put<Funcionario>(`/funcionarios/${id}`, funcionario);
    return response.data;
  },

  desativar: async (id: number): Promise<void> => {
    await api.delete(`/funcionarios/${id}`);
  }
}; 