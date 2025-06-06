package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    List<Funcionario> findByAtivo(boolean ativo);
    
    @Query("SELECT COUNT(f) FROM Funcionario f WHERE f.ativo = true")
    long countAtivos();

    long countByAtivo(boolean ativo);
} 