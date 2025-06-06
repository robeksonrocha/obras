import { RegistroPonto, FiltroRegistroPonto, RegistroPontoForm } from '../types/RegistroPonto';
import api from './api';
import * as XLSX from 'xlsx';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AxiosResponse } from 'axios';

const calcularHorasTrabalhadas = (registro: RegistroPonto): string => {
    let totalMinutos = 0;

    // Calcula período da manhã
    if (registro.horarioEntrada && registro.horarioSaidaAlmoco) {
        const entrada = parse(registro.horarioEntrada, 'HH:mm', new Date());
        const saidaAlmoco = parse(registro.horarioSaidaAlmoco, 'HH:mm', new Date());
        totalMinutos += (saidaAlmoco.getTime() - entrada.getTime()) / 1000 / 60;
    }

    // Calcula período da tarde
    if (registro.horarioRetornoAlmoco && registro.horarioSaida) {
        const retornoAlmoco = parse(registro.horarioRetornoAlmoco, 'HH:mm', new Date());
        const saida = parse(registro.horarioSaida, 'HH:mm', new Date());
        totalMinutos += (saida.getTime() - retornoAlmoco.getTime()) / 1000 / 60;
    }

    // Formata o resultado
    const horas = Math.floor(totalMinutos / 60);
    const minutos = Math.round(totalMinutos % 60);
    return `${horas}h${minutos.toString().padStart(2, '0')}min`;
};

const formatarData = (data: string): string => {
    return format(parse(data, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR });
};

const validarRegistros = (data: any): RegistroPonto[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') {
        // Verifica se é uma resposta paginada do Spring
        if (data.content && Array.isArray(data.content)) return data.content;
        // Verifica se é um objeto com array de registros
        if (data.registros && Array.isArray(data.registros)) return data.registros;
        // Verifica se é um objeto com array de items
        if (data.items && Array.isArray(data.items)) return data.items;
        // Se for um único objeto com as propriedades esperadas de RegistroPonto
        if (data.funcionarioId && data.obraId && data.data) return [data];
    }
    return [];
};

const registroPontoService = {
    buscarRegistros: async (filtros: FiltroRegistroPonto): Promise<RegistroPonto[]> => {
        try {
            const response = await api.get<any>('/registros-ponto', { 
                params: {
                    dataInicio: filtros.dataInicio,
                    dataFim: filtros.dataFim,
                    funcionarioId: filtros.funcionarioId,
                    obraId: filtros.obraId
                }
            });

            return validarRegistros(response.data);
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            return [];
        }
    },

    buscarPorId: async (id: number): Promise<RegistroPonto> => {
        const response = await api.get<RegistroPonto>(`/registros-ponto/${id}`);
        return response.data;
    },

    criar: async (registro: RegistroPontoForm): Promise<RegistroPonto> => {
        const response = await api.post<RegistroPonto>('/registros-ponto', registro);
        return response.data;
    },

    atualizar: async (id: number, registro: RegistroPontoForm): Promise<RegistroPonto> => {
        const response = await api.put<RegistroPonto>(`/registros-ponto/${id}`, registro);
        return response.data;
    },

    excluir: async (id: number): Promise<void> => {
        if (!id) throw new Error('ID é obrigatório');
        await api.delete(`/registros-ponto/${id}`);
    },

    exportarRegistros: async (filtros: FiltroRegistroPonto): Promise<void> => {
        const registros = await registroPontoService.buscarRegistros(filtros);
        
        // Agrupa os registros por funcionário
        const registrosPorFuncionario = registros.reduce((acc, registro) => {
            const nome = registro.funcionarioNome || 'Sem Nome';
            if (!acc[nome]) {
                acc[nome] = [];
            }
            acc[nome].push(registro);
            return acc;
        }, {} as { [key: string]: RegistroPonto[] });

        // Cria uma nova planilha
        const wb = XLSX.utils.book_new();

        // Para cada funcionário, cria uma aba
        Object.entries(registrosPorFuncionario).forEach(([funcionarioNome, registrosFuncionario]) => {
            const dados = registrosFuncionario.map(registro => ({
                'Data': format(new Date(registro.data), 'dd/MM/yyyy'),
                'Obra': registro.obraNome || '-',
                'Entrada': registro.horarioEntrada || '-',
                'Saída Almoço': registro.horarioSaidaAlmoco || '-',
                'Retorno Almoço': registro.horarioRetornoAlmoco || '-',
                'Saída': registro.horarioSaida || '-',
                'Distância da Obra (m)': registro.distanciaObra || '-'
            }));

            const ws = XLSX.utils.json_to_sheet(dados);
            XLSX.utils.book_append_sheet(wb, ws, funcionarioNome.substring(0, 31)); // Excel limita nome da aba em 31 caracteres
        });

        // Baixa o arquivo
        XLSX.writeFile(wb, `registros-ponto-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
    }
};

export { registroPontoService }; 