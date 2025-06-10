package com.obra.pontoeletronico.domain.port.in;

import com.obra.pontoeletronico.domain.model.Funcionario;
import java.util.List;
import java.util.Optional;

public interface FuncionarioUseCase {
    Funcionario criarFuncionario(Funcionario funcionario);
    Optional<Funcionario> buscarFuncionarioPorId(Long id);
    List<Funcionario> listarFuncionarios();
    List<Funcionario> listarFuncionariosPorObra(Long obraId);
    Funcionario atualizarFuncionario(Long id, Funcionario funcionario);
    void deletarFuncionario(Long id);
} 