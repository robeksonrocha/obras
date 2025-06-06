package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.Funcionario;
import com.obra.pontoeletronico.domain.Obra;
import com.obra.pontoeletronico.domain.RegistroPonto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RegistroPontoRepository extends JpaRepository<RegistroPonto, Long> {
    
    List<RegistroPonto> findByFuncionarioAndDataHoraBetween(
        Funcionario funcionario, LocalDateTime inicio, LocalDateTime fim);

    List<RegistroPonto> findByDataHoraBetweenAndObraOrderByDataHoraDesc(
        LocalDateTime inicio, LocalDateTime fim, Obra obra);

    List<RegistroPonto> findByDataHoraBetweenOrderByDataHoraDesc(
        LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT COUNT(r) FROM RegistroPonto r WHERE DATE(r.dataHora) = CURRENT_DATE")
    Long countRegistrosHoje();

    @Query("SELECT COUNT(r) FROM RegistroPonto r WHERE DATE(r.dataHora) = CURRENT_DATE AND r.dentroDoRaio = false")
    Long countAlertasHoje();

    List<RegistroPonto> findTop10ByOrderByDataHoraDesc();

    @Query("SELECT COUNT(DISTINCT r.funcionario) FROM RegistroPonto r " +
           "WHERE DATE(r.dataHora) = CURRENT_DATE AND r.obra.id = :obraId")
    Integer countFuncionariosPresentesHoje(Long obraId);

    RegistroPonto findFirstByFuncionarioOrderByDataHoraDesc(Funcionario funcionario);
} 