package com.obra.pontoeletronico.service;

import com.obra.pontoeletronico.domain.*;
import com.obra.pontoeletronico.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RegistroPontoServiceTest {

    @Mock
    private RegistroPontoRepository registroPontoRepository;

    @Mock
    private FuncionarioRepository funcionarioRepository;

    @Mock
    private ObraRepository obraRepository;

    private RegistroPontoService registroPontoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        registroPontoService = new RegistroPontoService(registroPontoRepository, funcionarioRepository, obraRepository);
    }

    @Test
    void registrarPontoComSucesso() {
        // Arrange
        Funcionario funcionario = new Funcionario();
        funcionario.setId(1L);
        funcionario.setNome("Teste");

        Obra obra = new Obra();
        obra.setId(1L);
        obra.setNome("Obra Teste");
        obra.setLatitude(-23.550520);
        obra.setLongitude(-46.633308);
        obra.setRaioPermitido(100);

        RegistroPonto registro = new RegistroPonto();
        registro.setFuncionario(funcionario);
        registro.setObra(obra);
        registro.setTipo(RegistroPonto.TipoRegistro.ENTRADA);
        registro.setDataHora(LocalDateTime.now());
        registro.setLatitude(-23.550520);
        registro.setLongitude(-46.633308);

        when(funcionarioRepository.findById(1L)).thenReturn(java.util.Optional.of(funcionario));
        when(obraRepository.findById(1L)).thenReturn(java.util.Optional.of(obra));
        when(registroPontoRepository.save(any(RegistroPonto.class))).thenReturn(registro);

        // Act
        RegistroPonto resultado = registroPontoService.registrarPonto(1L, 1L, RegistroPonto.TipoRegistro.ENTRADA, -23.550520, -46.633308);

        // Assert
        assertNotNull(resultado);
        assertEquals(funcionario, resultado.getFuncionario());
        assertEquals(obra, resultado.getObra());
        assertEquals(RegistroPonto.TipoRegistro.ENTRADA, resultado.getTipo());
        assertTrue(resultado.getDentroDoRaio());

        verify(registroPontoRepository).save(any(RegistroPonto.class));
    }

    @Test
    void registrarPontoManualComSucesso() {
        // Arrange
        Funcionario funcionario = new Funcionario();
        funcionario.setId(1L);
        funcionario.setNome("Teste");

        Obra obra = new Obra();
        obra.setId(1L);
        obra.setNome("Obra Teste");

        RegistroPonto registro = new RegistroPonto();
        registro.setFuncionario(funcionario);
        registro.setObra(obra);
        registro.setTipo(RegistroPonto.TipoRegistro.ENTRADA);
        registro.setDataHora(LocalDateTime.now());
        registro.setRegistroManual(true);
        registro.setObservacao("Registro manual de teste");

        when(funcionarioRepository.findById(1L)).thenReturn(java.util.Optional.of(funcionario));
        when(obraRepository.findById(1L)).thenReturn(java.util.Optional.of(obra));
        when(registroPontoRepository.save(any(RegistroPonto.class))).thenReturn(registro);

        // Act
        RegistroPonto resultado = registroPontoService.registrarPontoManual(1L, 1L, RegistroPonto.TipoRegistro.ENTRADA, LocalDateTime.now(), "Registro manual de teste");

        // Assert
        assertNotNull(resultado);
        assertEquals(funcionario, resultado.getFuncionario());
        assertEquals(obra, resultado.getObra());
        assertEquals(RegistroPonto.TipoRegistro.ENTRADA, resultado.getTipo());
        assertTrue(resultado.getRegistroManual());
        assertEquals("Registro manual de teste", resultado.getObservacao());

        verify(registroPontoRepository).save(any(RegistroPonto.class));
    }

    @Test
    void buscarRegistrosPorPeriodo() {
        // Arrange
        LocalDateTime inicio = LocalDateTime.now().minusDays(1);
        LocalDateTime fim = LocalDateTime.now();

        Funcionario funcionario = new Funcionario();
        funcionario.setId(1L);

        RegistroPonto registro = new RegistroPonto();
        registro.setFuncionario(funcionario);
        registro.setDataHora(LocalDateTime.now());

        when(funcionarioRepository.findById(1L)).thenReturn(java.util.Optional.of(funcionario));
        when(registroPontoRepository.findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(eq(funcionario), any(), any()))
            .thenReturn(Arrays.asList(registro));

        // Act
        List<RegistroPonto> resultados = registroPontoService.buscarRegistrosPorPeriodo(1L, inicio, fim);

        // Assert
        assertNotNull(resultados);
        assertFalse(resultados.isEmpty());
        assertEquals(1, resultados.size());
        assertEquals(funcionario, resultados.get(0).getFuncionario());

        verify(registroPontoRepository).findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(eq(funcionario), any(), any());
    }
} 