package com.obra.pontoeletronico.service;

import com.obra.pontoeletronico.domain.*;
import com.obra.pontoeletronico.dto.*;
import com.obra.pontoeletronico.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final FuncionarioRepository funcionarioRepository;
    private final ObraRepository obraRepository;
    private final RegistroPontoRepository registroPontoRepository;

    public DashboardDTO getDashboardData() {
        DashboardDTO dashboard = new DashboardDTO();

        // Dados gerais
        dashboard.setTotalFuncionarios(funcionarioRepository.count());
        dashboard.setTotalObrasAtivas(obraRepository.countByStatus(Obra.StatusObra.EM_ANDAMENTO));
        dashboard.setRegistrosHoje(registroPontoRepository.countByDataHoraBetween(
            LocalDateTime.now().withHour(0).withMinute(0),
            LocalDateTime.now().withHour(23).withMinute(59)
        ));
        dashboard.setTotalAlertas(registroPontoRepository.countByDentroDoRaioFalseAndDataHoraBetween(
            LocalDateTime.now().withHour(0).withMinute(0),
            LocalDateTime.now().withHour(23).withMinute(59)
        ));

        // Últimos registros
        List<RegistroPontoResumoDTO> ultimosRegistros = registroPontoRepository.findTop10ByOrderByDataHoraDesc()
            .stream()
            .map(registro -> {
                RegistroPontoResumoDTO dto = new RegistroPontoResumoDTO();
                dto.setId(registro.getId());
                dto.setFuncionarioNome(registro.getFuncionario().getNome());
                dto.setObraNome(registro.getObra().getNome());
                dto.setTipo(registro.getTipo().toString());
                dto.setDataHora(registro.getDataHora());
                dto.setDentroDoRaio(registro.getDentroDoRaio());
                return dto;
            })
            .collect(Collectors.toList());
        dashboard.setUltimosRegistros(ultimosRegistros);

        // Obras com mais funcionários
        List<ObraResumoDTO> obrasComMaisFuncionarios = obraRepository.findAll().stream()
            .map(obra -> {
                ObraResumoDTO dto = new ObraResumoDTO();
                dto.setId(obra.getId());
                dto.setNome(obra.getNome());
                dto.setTotalFuncionarios(funcionarioRepository.countByObraAndAtivoTrue(obra));
                dto.setRegistrosHoje(registroPontoRepository.countByObraAndDataHoraBetween(
                    obra,
                    LocalDateTime.now().withHour(0).withMinute(0),
                    LocalDateTime.now().withHour(23).withMinute(59)
                ));
                return dto;
            })
            .sorted((o1, o2) -> o2.getTotalFuncionarios() - o1.getTotalFuncionarios())
            .limit(5)
            .collect(Collectors.toList());
        dashboard.setObrasComMaisFuncionarios(obrasComMaisFuncionarios);

        // Status de presença dos funcionários
        List<FuncionarioPresencaDTO> presencaFuncionarios = funcionarioRepository.findByAtivoTrue().stream()
            .map(funcionario -> {
                FuncionarioPresencaDTO dto = new FuncionarioPresencaDTO();
                dto.setId(funcionario.getId());
                dto.setNome(funcionario.getNome());
                dto.setCargo(funcionario.getCargo());

                RegistroPonto ultimoRegistro = registroPontoRepository
                    .findFirstByFuncionarioOrderByDataHoraDesc(funcionario)
                    .orElse(null);

                if (ultimoRegistro != null) {
                    LocalDateTime dataHora = ultimoRegistro.getDataHora();
                    if (dataHora.toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
                        if (ultimoRegistro.getTipo() == RegistroPonto.TipoRegistro.ENTRADA) {
                            dto.setStatus("PRESENTE");
                            dto.setObraNome(ultimoRegistro.getObra().getNome());
                        } else {
                            dto.setStatus("AUSENTE");
                        }
                    } else {
                        dto.setStatus("AUSENTE");
                    }
                } else {
                    dto.setStatus("NUNCA_REGISTROU");
                }

                return dto;
            })
            .collect(Collectors.toList());
        dashboard.setPresencaFuncionarios(presencaFuncionarios);

        return dashboard;
    }
} 