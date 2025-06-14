export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  role: string;
}

export interface Obra {
  id: number;
  nome: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  obra: Obra;
}

export interface RegistroPonto {
  id?: number;
  funcionarioId: number;
  data: string;
  horarioEntrada?: string;
  saidaAlmoco?: string;
  retornoAlmoco?: string;
  horarioSaida?: string;
  totalHorasTrabalhadas?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginData {
  email: string;
  senha: string;
} 