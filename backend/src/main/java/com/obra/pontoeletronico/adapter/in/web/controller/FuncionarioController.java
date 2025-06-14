package com.obra.pontoeletronico.adapter.in.web.controller;

import com.obra.pontoeletronico.domain.model.Funcionario;
import com.obra.pontoeletronico.domain.port.in.FuncionarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
@Tag(name = "Funcionário", description = "Operações de CRUD para funcionários")
public class FuncionarioController {
    private final FuncionarioUseCase funcionarioUseCase;
    private static final Logger logger = LoggerFactory.getLogger(FuncionarioController.class);

    @GetMapping
    @Operation(summary = "Listar todos os funcionários")
    public ResponseEntity<List<Funcionario>> listarFuncionarios() {
        return ResponseEntity.ok(funcionarioUseCase.listarFuncionarios());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar funcionário por ID")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return funcionarioUseCase.buscarFuncionarioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar novo funcionário")
    public ResponseEntity<Funcionario> criar(@RequestBody Funcionario funcionario) {
        logger.info("[FuncionarioController] Recebido obraId: {} para funcionário {}", funcionario.getObra() != null ? funcionario.getObra().getId() : null, funcionario.getNome());
        logger.debug("[FuncionarioController] Parâmetros recebidos para novo funcionário: nome={}, cpf={}, cargo={}, telefone={}, ativo={}, obraId={}, usuarioId={}",
                funcionario.getNome(),
                funcionario.getCpf(),
                funcionario.getCargo(),
                funcionario.getTelefone(),
                funcionario.isAtivo(),
                funcionario.getObra() != null ? funcionario.getObra().getId() : null,
                funcionario.getUsuario() != null ? funcionario.getUsuario().getId() : null
        );
        Funcionario novo = funcionarioUseCase.criarFuncionario(funcionario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar funcionário")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        try {
            Funcionario atualizado = funcionarioUseCase.atualizarFuncionario(id, funcionario);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar funcionário")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        funcionarioUseCase.deletarFuncionario(id);
        return ResponseEntity.noContent().build();
    }
} 