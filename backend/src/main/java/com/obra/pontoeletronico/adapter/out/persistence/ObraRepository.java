package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long> {
    long countByStatus(String status);
    
    List<Obra> findByStatus(String status);
    
    @Query("SELECT o FROM Obra o " +
           "WHERE o.status = :status " +
           "ORDER BY (SELECT COUNT(f) FROM Funcionario f WHERE f.obraAtual = o) DESC")
    List<Obra> findTop5ByStatusOrderByTotalFuncionariosDesc(@Param("status") String status);
    
    @Query("SELECT COUNT(f) FROM Funcionario f WHERE f.obraAtual.id = :obraId")
    int getTotalFuncionarios(@Param("obraId") Long obraId);
} 