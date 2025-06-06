package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.adapter.out.persistence.FuncionarioRepository;
import com.obra.pontoeletronico.domain.Funcionario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FuncionarioController {

    private final FuncionarioRepository funcionarioRepository;

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    @GetMapping("/ativos")
    public List<Funcionario> listarAtivos() {
        return funcionarioRepository.findByAtivo(true);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return funcionarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Funcionario criar(@RequestBody Funcionario funcionario) {
        funcionario.setId(null); // Garante que será uma nova inserção
        return funcionarioRepository.save(funcionario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        if (!funcionarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        funcionario.setId(id);
        return ResponseEntity.ok(funcionarioRepository.save(funcionario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        return funcionarioRepository.findById(id)
                .map(funcionario -> {
                    funcionario.setAtivo(false);
                    funcionarioRepository.save(funcionario);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 