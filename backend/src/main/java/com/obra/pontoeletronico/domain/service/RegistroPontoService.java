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
    
    @Override
    @Transactional(readOnly = true)
    public List<RegistroPonto> listarRegistrosComFiltro(Long funcionarioId, Long obraId, LocalDate dataInicio, LocalDate dataFim) {
        List<RegistroPonto> todos = registroPontoRepository.findAll();
        return todos.stream()
            .filter(r -> funcionarioId == null || r.getFuncionario().getId().equals(funcionarioId))
            .filter(r -> obraId == null || (r.getFuncionario().getObra() != null && r.getFuncionario().getObra().getId().equals(obraId)))
            .filter(r -> dataInicio == null || !r.getDataHora().toLocalDate().isBefore(dataInicio))
            .filter(r -> dataFim == null || !r.getDataHora().toLocalDate().isAfter(dataFim))
            .toList();
    }
} 