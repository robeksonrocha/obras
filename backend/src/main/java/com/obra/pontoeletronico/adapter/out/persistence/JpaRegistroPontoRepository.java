package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.model.RegistroPonto;
import com.obra.pontoeletronico.domain.port.out.RegistroPontoRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface JpaRegistroPontoRepository extends JpaRepository<RegistroPonto, Long>, RegistroPontoRepository {
    List<RegistroPonto> findByFuncionarioId(Long funcionarioId);
    
    @Query("SELECT r FROM RegistroPonto r WHERE r.funcionario.id = :funcionarioId AND DATE(r.dataHora) = :data")
    List<RegistroPonto> findByFuncionarioIdAndData(@Param("funcionarioId") Long funcionarioId, @Param("data") LocalDate data);
    
    @Query("SELECT r FROM RegistroPonto r WHERE r.funcionario.obra.id = :obraId AND DATE(r.dataHora) = :data")
    List<RegistroPonto> findByObraIdAndData(@Param("obraId") Long obraId, @Param("data") LocalDate data);
} 