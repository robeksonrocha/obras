import api from './api';

export interface RegistroPonto {
  id: number;
  funcionarioNome: string;
  obra: string;
  tipo: 'ENTRADA' | 'SAIDA';
  dataHora: string;
}

export interface DashboardData {
  totalFuncionarios: number;
  obrasAtivas: number;
  registrosHoje: number;
  totalAlertas: number;
  ultimosRegistros: RegistroPonto[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  // Dados mockados para desenvolvimento
  const dadosMockados: DashboardData = {
    totalFuncionarios: 25,
    obrasAtivas: 5,
    registrosHoje: 42,
    totalAlertas: 3,
    ultimosRegistros: [
      {
        id: 1,
        funcionarioNome: "João Silva",
        obra: "Obra Centro Empresarial",
        tipo: "ENTRADA",
        dataHora: "2025-06-06T08:00:00"
      },
      {
        id: 2,
        funcionarioNome: "Maria Santos",
        obra: "Residencial Park",
        tipo: "ENTRADA",
        dataHora: "2025-06-06T07:45:00"
      },
      {
        id: 3,
        funcionarioNome: "Pedro Oliveira",
        obra: "Shopping Plaza",
        tipo: "SAIDA",
        dataHora: "2025-06-06T17:00:00"
      }
    ]
  };

  return dadosMockados;

  // Código original comentado
  // const response = await api.get<DashboardData>('/dashboard');
  // return response.data;
}; 