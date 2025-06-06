import { format } from 'date-fns';

export interface RegistroPonto {
    id?: number;
    funcionarioId: number;
    obraId: number;
    data: string;
    horarioEntrada: string;
    horarioSaidaAlmoco: string;
    horarioRetornoAlmoco: string;
    horarioSaida: string;
    funcionarioNome?: string;
    obraNome?: string;
    latitude?: number;
    longitude?: number;
    distanciaObra?: number;
}

export interface FiltroRegistroPonto {
    dataInicio?: string;
    dataFim?: string;
    funcionarioId?: number;
    obraId?: number;
}

export interface RegistroPontoForm {
    id?: number;
    funcionarioId: number;
    obraId: number;
    data: string;
    horarioEntrada: string;
    horarioSaidaAlmoco: string;
    horarioRetornoAlmoco: string;
    horarioSaida: string;
    funcionarioNome?: string;
    obraNome?: string;
    latitude?: number;
    longitude?: number;
    distanciaObra?: number;
}

export const REGISTRO_INICIAL: RegistroPontoForm = {
    funcionarioId: 0,
    obraId: 0,
    data: format(new Date(), 'yyyy-MM-dd'),
    horarioEntrada: '',
    horarioSaidaAlmoco: '',
    horarioRetornoAlmoco: '',
    horarioSaida: ''
}; 