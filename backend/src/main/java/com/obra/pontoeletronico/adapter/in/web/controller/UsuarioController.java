package com.obra.pontoeletronico.adapter.in.web.controller;

import com.obra.pontoeletronico.domain.model.Usuario;
import com.obra.pontoeletronico.domain.port.in.UsuarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuário", description = "Operações de CRUD para usuários")
public class UsuarioController {
    private final UsuarioUseCase usuarioUseCase;

    @GetMapping
    @Operation(summary = "Listar todos os usuários")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioUseCase.listarUsuarios());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuário por ID")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioUseCase.buscarUsuarioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar novo usuário")
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        Usuario novo = usuarioUseCase.criarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar usuário")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            Usuario atualizado = usuarioUseCase.atualizarUsuario(id, usuario);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar usuário")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioUseCase.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
} 