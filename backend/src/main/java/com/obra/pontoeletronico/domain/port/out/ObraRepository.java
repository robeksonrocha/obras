package com.obra.pontoeletronico.domain.port.out;

import com.obra.pontoeletronico.domain.model.Obra;
import java.util.List;
import java.util.Optional;

public interface ObraRepository {
    Obra save(Obra obra);
    Optional<Obra> findById(Long id);
    List<Obra> findAll();
    void deleteById(Long id);
} 