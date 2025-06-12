package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.domain.model.Obra;
import com.obra.pontoeletronico.domain.port.in.ObraUseCase;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/obras")
@RequiredArgsConstructor
public class ObraController {

    private static final Logger logger = LoggerFactory.getLogger(ObraController.class);

    private final ObraUseCase obraUseCase;

    @PostMapping
    public ResponseEntity<Obra> criarObra(@RequestBody Obra obra) {
        Obra novaObra = obraUseCase.criarObra(obra);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaObra);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Obra> buscarObraPorId(@PathVariable Long id) {
        return obraUseCase.buscarObraPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Obra>> listarObras() {
        logger.info("[ObraController] Endpoint listarObras chamado");
        List<Obra> obras = obraUseCase.listarObras();
        logger.info("[ObraController] Quantidade de obras retornadas: {}", obras.size());
        return ResponseEntity.ok(obras);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Obra> atualizarObra(@PathVariable Long id, @RequestBody Obra obra) {
        try {
            Obra obraAtualizada = obraUseCase.atualizarObra(id, obra);
            return ResponseEntity.ok(obraAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarObra(@PathVariable Long id) {
        obraUseCase.deletarObra(id);
        return ResponseEntity.noContent().build();
    }
} 