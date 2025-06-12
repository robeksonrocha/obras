package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.domain.model.RegistroPonto;
import com.obra.pontoeletronico.domain.port.in.RegistroPontoUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/registros-ponto")
@RequiredArgsConstructor
public class RegistroPontoController {

    private final RegistroPontoUseCase registroPontoUseCase;
    private static final Logger logger = LoggerFactory.getLogger(RegistroPontoController.class);

    @PostMapping
    public ResponseEntity<RegistroPonto> registrarPonto(@RequestBody RegistroPonto registro) {
        RegistroPonto novoRegistro = registroPontoUseCase.registrarPonto(registro);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRegistro);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroPonto> buscarRegistroPorId(@PathVariable Long id) {
        return registroPontoUseCase.buscarRegistroPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<RegistroPonto>> listarRegistrosPorFuncionario(@PathVariable Long funcionarioId) {
        List<RegistroPonto> registros = registroPontoUseCase.listarRegistrosPorFuncionario(funcionarioId);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/funcionario/{funcionarioId}/data/{data}")
    public ResponseEntity<List<RegistroPonto>> listarRegistrosPorFuncionarioEData(@PathVariable Long funcionarioId, @PathVariable LocalDate data) {
        List<RegistroPonto> registros = registroPontoUseCase.listarRegistrosPorFuncionarioEData(funcionarioId, data);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/obra/{obraId}/data/{data}")
    public ResponseEntity<List<RegistroPonto>> listarRegistrosPorObraEData(@PathVariable Long obraId, @PathVariable LocalDate data) {
        List<RegistroPonto> registros = registroPontoUseCase.listarRegistrosPorObraEData(obraId, data);
        return ResponseEntity.ok(registros);
    }

    @GetMapping
    public ResponseEntity<List<RegistroPonto>> listarRegistros(
        @RequestParam(required = false) Long funcionarioId,
        @RequestParam(required = false) Long obraId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            logger.info("Usuário autenticado: {} | Roles: {}", authentication.getName(), authentication.getAuthorities());
        } else {
            logger.warn("Nenhum usuário autenticado encontrado no contexto de segurança.");
        }
        List<RegistroPonto> registros = registroPontoUseCase.listarRegistrosComFiltro(funcionarioId, obraId, dataInicio, dataFim);
        return ResponseEntity.ok(registros);
    }
} 