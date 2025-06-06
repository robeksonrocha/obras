package com.obra.pontoeletronico.service;

import com.obra.pontoeletronico.domain.*;
import com.obra.pontoeletronico.dto.DashboardDTO;
import com.obra.pontoeletronico.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class DashboardServiceTest {

    @Mock
    private FuncionarioRepository funcionarioRepository;

    @Mock
    private ObraRepository obraRepository;

    @Mock
    private RegistroPontoRepository registroPontoRepository;

    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dashboardService = new DashboardService(funcionarioRepository, obraRepository, registroPontoRepository);
    }

    @Test
    void getDashboardDataComDadosValidos() {
        // Arrange
        LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0);
        LocalDateTime fimDia = LocalDateTime.now().withHour(23).withMinute(59);

        Funcionario funcionario = new Funcionario();
        funcionario.setId(1L);
        funcionario.setNome("Teste");
        funcionario.setCargo("Pedreiro");
        funcionario.setAtivo(true);

        Obra obra = new Obra();
        obra.setId(1L);
        obra.setNome("Obra Teste");
        obra.setStatus(Obra.StatusObra.EM_ANDAMENTO);

        RegistroPonto registro = new RegistroPonto();
        registro.setId(1L);
        registro.setFuncionario(funcionario);
        registro.setObra(obra);
        registro.setTipo(RegistroPonto.TipoRegistro.ENTRADA);
        registro.setDataHora(LocalDateTime.now());
        registro.setDentroDoRaio(true);

        // Mock dos repositórios
        when(funcionarioRepository.count()).thenReturn(10L);
        when(obraRepository.countByStatus(Obra.StatusObra.EM_ANDAMENTO)).thenReturn(5L);
        when(registroPontoRepository.countByDataHoraBetween(any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(20L);
        when(registroPontoRepository.countByDentroDoRaioFalseAndDataHoraBetween(any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(2L);
        when(registroPontoRepository.findTop10ByOrderByDataHoraDesc()).thenReturn(Arrays.asList(registro));
        when(obraRepository.findAll()).thenReturn(Arrays.asList(obra));
        when(funcionarioRepository.findByAtivoTrue()).thenReturn(Arrays.asList(funcionario));
        when(registroPontoRepository.findFirstByFuncionarioOrderByDataHoraDesc(any(Funcionario.class))).thenReturn(Optional.of(registro));
        when(funcionarioRepository.countByObraAndAtivoTrue(any(Obra.class))).thenReturn(5);
        when(registroPontoRepository.countByObraAndDataHoraBetween(any(Obra.class), any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(3L);

        // Act
        DashboardDTO result = dashboardService.getDashboardData();

        // Assert
        assertNotNull(result);
        assertEquals(10L, result.getTotalFuncionarios());
        assertEquals(5L, result.getTotalObrasAtivas());
        assertEquals(20L, result.getRegistrosHoje());
        assertEquals(2L, result.getTotalAlertas());
        assertNotNull(result.getUltimosRegistros());
        assertFalse(result.getUltimosRegistros().isEmpty());
        assertEquals(1, result.getUltimosRegistros().size());
        assertNotNull(result.getObrasComMaisFuncionarios());
        assertFalse(result.getObrasComMaisFuncionarios().isEmpty());
        assertEquals(1, result.getObrasComMaisFuncionarios().size());
        assertNotNull(result.getPresencaFuncionarios());
        assertFalse(result.getPresencaFuncionarios().isEmpty());
        assertEquals(1, result.getPresencaFuncionarios().size());

        // Verify
        verify(funcionarioRepository).count();
        verify(obraRepository).countByStatus(Obra.StatusObra.EM_ANDAMENTO);
        verify(registroPontoRepository).countByDataHoraBetween(any(LocalDateTime.class), any(LocalDateTime.class));
        verify(registroPontoRepository).countByDentroDoRaioFalseAndDataHoraBetween(any(LocalDateTime.class), any(LocalDateTime.class));
        verify(registroPontoRepository).findTop10ByOrderByDataHoraDesc();
        verify(obraRepository).findAll();
        verify(funcionarioRepository).findByAtivoTrue();
        verify(registroPontoRepository).findFirstByFuncionarioOrderByDataHoraDesc(any(Funcionario.class));
        verify(funcionarioRepository).countByObraAndAtivoTrue(any(Obra.class));
        verify(registroPontoRepository).countByObraAndDataHoraBetween(any(Obra.class), any(LocalDateTime.class), any(LocalDateTime.class));
    }
} 