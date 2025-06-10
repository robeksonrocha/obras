package com.obra.pontoeletronico.domain.port.in;

import com.obra.pontoeletronico.domain.model.Obra;
import java.util.List;
import java.util.Optional;

public interface ObraUseCase {
    Obra criarObra(Obra obra);
    Optional<Obra> buscarObraPorId(Long id);
    List<Obra> listarObras();
    Obra atualizarObra(Long id, Obra obra);
    void deletarObra(Long id);
} 