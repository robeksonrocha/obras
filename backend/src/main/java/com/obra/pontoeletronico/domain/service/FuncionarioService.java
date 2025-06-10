package com.obra.pontoeletronico.domain.service;

import com.obra.pontoeletronico.domain.model.Funcionario;
import com.obra.pontoeletronico.domain.port.in.FuncionarioUseCase;
import com.obra.pontoeletronico.domain.port.out.FuncionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FuncionarioService implements FuncionarioUseCase {
    
    private final FuncionarioRepository funcionarioRepository;
    
    @Override
    @Transactional
    public Funcionario criarFuncionario(Funcionario funcionario) {
        return funcionarioRepository.save(funcionario);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Funcionario> buscarFuncionarioPorId(Long id) {
        return funcionarioRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Funcionario> listarFuncionarios() {
        return funcionarioRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Funcionario> listarFuncionariosPorObra(Long obraId) {
        return funcionarioRepository.findByObraId(obraId);
    }
    
    @Override
    @Transactional
    public Funcionario atualizarFuncionario(Long id, Funcionario funcionario) {
        return funcionarioRepository.findById(id)
            .map(funcionarioExistente -> {
                funcionario.setId(id);
                return funcionarioRepository.save(funcionario);
            })
            .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }
    
    @Override
    @Transactional
    public void deletarFuncionario(Long id) {
        funcionarioRepository.deleteById(id);
    }
} 