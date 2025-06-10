package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.model.Funcionario;
import com.obra.pontoeletronico.domain.port.out.FuncionarioRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaFuncionarioRepository extends JpaRepository<Funcionario, Long>, FuncionarioRepository {
    List<Funcionario> findByObraId(Long obraId);
} 