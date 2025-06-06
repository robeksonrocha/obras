package com.obra.pontoeletronico.repository;

import com.obra.pontoeletronico.domain.Funcionario;
import com.obra.pontoeletronico.domain.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    List<Funcionario> findByAtivoTrue();
    int countByObraAndAtivoTrue(Obra obra);
} 