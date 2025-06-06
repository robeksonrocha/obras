package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.domain.RegistroPonto;
import com.obra.pontoeletronico.domain.Funcionario;
import com.obra.pontoeletronico.domain.Obra;
import com.obra.pontoeletronico.adapter.out.persistence.RegistroPontoRepository;
import com.obra.pontoeletronico.adapter.out.persistence.FuncionarioRepository;
import com.obra.pontoeletronico.adapter.out.persistence.ObraRepository;
import com.obra.pontoeletronico.service.RegistroPontoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registros-ponto")
@RequiredArgsConstructor
public class RegistroPontoController {

    private final RegistroPontoRepository registroPontoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final ObraRepository obraRepository;
    private final RegistroPontoService registroPontoService;

    @GetMapping
    public ResponseEntity<List<RegistroPonto>> buscarRegistros(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @RequestParam(required = false) Long funcionarioId,
            @RequestParam(required = false) Long obraId) {

        List<RegistroPonto> registros;
        
        if (funcionarioId != null) {
            Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
            registros = registroPontoRepository.findByFuncionarioAndDataHoraBetween(funcionario, dataInicio, dataFim);
        } else if (obraId != null) {
            Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
            registros = registroPontoRepository.findByDataHoraBetweenAndObraOrderByDataHoraDesc(dataInicio, dataFim, obra);
        } else {
            registros = registroPontoRepository.findByDataHoraBetweenOrderByDataHoraDesc(dataInicio, dataFim);
        }

        return ResponseEntity.ok(registros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroPonto> buscarPorId(@PathVariable Long id) {
        return registroPontoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/manual")
    public ResponseEntity<RegistroPonto> criarRegistroManual(@RequestBody Map<String, Object> dados) {
        try {
            Funcionario funcionario = funcionarioRepository.findById(Long.parseLong(dados.get("funcionarioId").toString()))
                    .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));

            Obra obra = obraRepository.findById(Long.parseLong(dados.get("obraId").toString()))
                    .orElseThrow(() -> new IllegalArgumentException("Obra não encontrada"));

            LocalDate data = LocalDate.parse((String) dados.get("data"));
            
            // Cria registros para cada horário informado
            if (dados.get("horarioEntrada") != null) {
                criarRegistro(funcionario, obra, data, (String) dados.get("horarioEntrada"), RegistroPonto.TipoRegistro.ENTRADA);
            }
            
            if (dados.get("horarioSaidaAlmoco") != null) {
                criarRegistro(funcionario, obra, data, (String) dados.get("horarioSaidaAlmoco"), RegistroPonto.TipoRegistro.SAIDA_ALMOCO);
            }
            
            if (dados.get("horarioRetornoAlmoco") != null) {
                criarRegistro(funcionario, obra, data, (String) dados.get("horarioRetornoAlmoco"), RegistroPonto.TipoRegistro.RETORNO_ALMOCO);
            }
            
            if (dados.get("horarioSaida") != null) {
                criarRegistro(funcionario, obra, data, (String) dados.get("horarioSaida"), RegistroPonto.TipoRegistro.SAIDA);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroPonto> atualizarRegistro(@PathVariable Long id, @RequestBody RegistroPonto registro) {
        if (!registroPontoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        registro.setId(id);
        return ResponseEntity.ok(registroPontoRepository.save(registro));
    }

    private void criarRegistro(Funcionario funcionario, Obra obra, LocalDate data, String horario, RegistroPonto.TipoRegistro tipo) {
        LocalTime time = LocalTime.parse(horario);
        LocalDateTime dataHora = LocalDateTime.of(data, time);

        RegistroPonto registro = new RegistroPonto();
        registro.setFuncionario(funcionario);
        registro.setObra(obra);
        registro.setDataHora(dataHora);
        registro.setTipo(tipo);
        registro.setLatitude(obra.getLatitude());
        registro.setLongitude(obra.getLongitude());
        registro.setRegistroManual(true);

        registroPontoRepository.save(registro);
    }
} 