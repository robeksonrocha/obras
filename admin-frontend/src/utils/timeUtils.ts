export const calcularHorasTrabalhadas = (
    horarioEntrada: string,
    horarioSaidaAlmoco: string,
    horarioRetornoAlmoco: string,
    horarioSaida: string
): string => {
    const [horaEntrada, minEntrada] = horarioEntrada.split(':').map(Number);
    const [horaSaidaAlmoco, minSaidaAlmoco] = horarioSaidaAlmoco.split(':').map(Number);
    const [horaRetornoAlmoco, minRetornoAlmoco] = horarioRetornoAlmoco.split(':').map(Number);
    const [horaSaida, minSaida] = horarioSaida.split(':').map(Number);

    // Converter tudo para minutos
    const entradaEmMin = horaEntrada * 60 + minEntrada;
    const saidaAlmocoEmMin = horaSaidaAlmoco * 60 + minSaidaAlmoco;
    const retornoAlmocoEmMin = horaRetornoAlmoco * 60 + minRetornoAlmoco;
    const saidaEmMin = horaSaida * 60 + minSaida;

    // Calcular tempo total (excluindo almoço)
    const periodoManha = saidaAlmocoEmMin - entradaEmMin;
    const periodoTarde = saidaEmMin - retornoAlmocoEmMin;
    const totalMinutos = periodoManha + periodoTarde;

    // Converter de volta para horas e minutos
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
}; 