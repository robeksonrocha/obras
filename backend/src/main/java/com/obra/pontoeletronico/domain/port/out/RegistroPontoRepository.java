package com.obra.pontoeletronico.domain.port.out;

import com.obra.pontoeletronico.domain.model.RegistroPonto;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistroPontoRepository {
    RegistroPonto save(RegistroPonto registro);
    Optional<RegistroPonto> findById(Long id);
    List<RegistroPonto> findByFuncionarioId(Long funcionarioId);
    List<RegistroPonto> findByFuncionarioIdAndData(Long funcionarioId, LocalDate data);
    List<RegistroPonto> findByObraIdAndData(Long obraId, LocalDate data);
} 