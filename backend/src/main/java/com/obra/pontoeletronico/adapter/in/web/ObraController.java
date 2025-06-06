package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.adapter.out.persistence.ObraRepository;
import com.obra.pontoeletronico.domain.Obra;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/obras")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ObraController {

    private final ObraRepository obraRepository;

    @GetMapping
    public List<Obra> listarTodas() {
        return obraRepository.findAll();
    }

    @GetMapping("/ativas")
    public List<Obra> listarAtivas() {
        return obraRepository.findByStatus("EM_ANDAMENTO");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Obra> buscarPorId(@PathVariable Long id) {
        return obraRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Obra criar(@RequestBody Obra obra) {
        obra.setId(null);
        return obraRepository.save(obra);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Obra> atualizar(@PathVariable Long id, @RequestBody Obra obra) {
        if (!obraRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        obra.setId(id);
        return ResponseEntity.ok(obraRepository.save(obra));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!obraRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        obraRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 