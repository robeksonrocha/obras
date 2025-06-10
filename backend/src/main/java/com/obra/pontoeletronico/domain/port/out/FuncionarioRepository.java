package com.obra.pontoeletronico.domain.port.out;

import com.obra.pontoeletronico.domain.model.Funcionario;
import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository {
    Funcionario save(Funcionario funcionario);
    Optional<Funcionario> findById(Long id);
    List<Funcionario> findAll();
    List<Funcionario> findByObraId(Long obraId);
    void deleteById(Long id);
} 