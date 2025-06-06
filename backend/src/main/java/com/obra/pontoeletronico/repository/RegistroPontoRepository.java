package com.obra.pontoeletronico.repository;

import com.obra.pontoeletronico.domain.Funcionario;
import com.obra.pontoeletronico.domain.Obra;
import com.obra.pontoeletronico.domain.RegistroPonto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroPontoRepository extends JpaRepository<RegistroPonto, Long> {
    List<RegistroPonto> findTop10ByOrderByDataHoraDesc();
    Optional<RegistroPonto> findFirstByFuncionarioOrderByDataHoraDesc(Funcionario funcionario);
    long countByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
    long countByDentroDoRaioFalseAndDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
    long countByObraAndDataHoraBetween(Obra obra, LocalDateTime inicio, LocalDateTime fim);
    List<RegistroPonto> findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(Funcionario funcionario, LocalDateTime inicio, LocalDateTime fim);
} 