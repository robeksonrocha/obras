import api from './api';
import { RegistroPonto } from '../types';
import { format } from 'date-fns';

export const registrarPonto = async (funcionarioId: number): Promise<RegistroPonto> => {
  const agora = new Date();
  const data = format(agora, 'yyyy-MM-dd');
  const horario = format(agora, 'HH:mm:ss');

  // Busca o registro do dia atual
  const response = await api.get<RegistroPonto[]>(`/registros-ponto/funcionario/${funcionarioId}/data/${data}`);
  let registro = response.data[0];

  if (!registro) {
    // Se não existe registro, cria um novo com horário de entrada
    registro = await api.post<RegistroPonto>('/registros-ponto', {
      funcionarioId,
      data,
      horarioEntrada: horario
    }).then(res => res.data);
  } else {
    // Se já existe registro, atualiza o próximo horário disponível
    if (!registro.saidaAlmoco) {
      registro = await api.put<RegistroPonto>(`/registros-ponto/${registro.id}`, {
        ...registro,
        saidaAlmoco: horario
      }).then(res => res.data);
    } else if (!registro.retornoAlmoco) {
      registro = await api.put<RegistroPonto>(`/registros-ponto/${registro.id}`, {
        ...registro,
        retornoAlmoco: horario
      }).then(res => res.data);
    } else if (!registro.horarioSaida) {
      registro = await api.put<RegistroPonto>(`/registros-ponto/${registro.id}`, {
        ...registro,
        horarioSaida: horario
      }).then(res => res.data);
    }
  }

  return registro;
};

export const buscarRegistroDoDia = async (funcionarioId: number): Promise<RegistroPonto | null> => {
  const hoje = format(new Date(), 'yyyy-MM-dd');
  const response = await api.get<RegistroPonto[]>(`/registros-ponto/funcionario/${funcionarioId}/data/${hoje}`);
  return response.data[0] || null;
}; 