package com.obra.pontoeletronico.domain.service;

import com.obra.pontoeletronico.domain.model.Obra;
import com.obra.pontoeletronico.domain.port.in.ObraUseCase;
import com.obra.pontoeletronico.domain.port.out.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ObraService implements ObraUseCase {
    
    private final ObraRepository obraRepository;
    
    @Override
    @Transactional
    public Obra criarObra(Obra obra) {
        return obraRepository.save(obra);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Obra> buscarObraPorId(Long id) {
        return obraRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Obra> listarObras() {
        return obraRepository.findAll();
    }
    
    @Override
    @Transactional
    public Obra atualizarObra(Long id, Obra obra) {
        return obraRepository.findById(id)
            .map(obraExistente -> {
                obra.setId(id);
                return obraRepository.save(obra);
            })
            .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
    }
    
    @Override
    @Transactional
    public void deletarObra(Long id) {
        obraRepository.deleteById(id);
    }
} 