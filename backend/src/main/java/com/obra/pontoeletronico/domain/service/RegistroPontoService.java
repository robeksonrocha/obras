package com.obra.pontoeletronico.domain.service;

import com.obra.pontoeletronico.domain.model.RegistroPonto;
import com.obra.pontoeletronico.domain.port.in.RegistroPontoUseCase;
import com.obra.pontoeletronico.domain.port.out.RegistroPontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistroPontoService implements RegistroPontoUseCase {
    
    private final RegistroPontoRepository registroPontoRepository;
    
    @Override
    @Transactional
    public RegistroPonto registrarPonto(RegistroPonto registro) {
        return registroPontoRepository.save(registro);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<RegistroPonto> buscarRegistroPorId(Long id) {
        return registroPontoRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RegistroPonto> listarRegistrosPorFuncionario(Long funcionarioId) {
        return registroPontoRepository.findByFuncionarioId(funcionarioId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RegistroPonto> listarRegistrosPorFuncionarioEData(Long funcionarioId, LocalDate data) {
        return registroPontoRepository.findByFuncionarioIdAndData(funcionarioId, data);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RegistroPonto> listarRegistrosPorObraEData(Long obraId, LocalDate data) {
        return registroPontoRepository.findByObraIdAndData(obraId, data);
    }
} 