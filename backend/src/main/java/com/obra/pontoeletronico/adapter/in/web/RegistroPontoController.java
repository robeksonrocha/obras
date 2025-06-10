package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.domain.model.RegistroPonto;
import com.obra.pontoeletronico.domain.port.in.RegistroPontoUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/registros-ponto")
@RequiredArgsConstructor
public class RegistroPontoController {

    private final RegistroPontoUseCase registroPontoUseCase;

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
} 