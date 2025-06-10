package com.obra.pontoeletronico.domain.port.in;

import com.obra.pontoeletronico.domain.model.RegistroPonto;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistroPontoUseCase {
    RegistroPonto registrarPonto(RegistroPonto registro);
    Optional<RegistroPonto> buscarRegistroPorId(Long id);
    List<RegistroPonto> listarRegistrosPorFuncionario(Long funcionarioId);
    List<RegistroPonto> listarRegistrosPorFuncionarioEData(Long funcionarioId, LocalDate data);
    List<RegistroPonto> listarRegistrosPorObraEData(Long obraId, LocalDate data);
} 