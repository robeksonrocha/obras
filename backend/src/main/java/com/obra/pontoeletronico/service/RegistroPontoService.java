package com.obra.pontoeletronico.service;

import com.obra.pontoeletronico.repository.RegistroPontoRepository;
import com.obra.pontoeletronico.repository.FuncionarioRepository;
import com.obra.pontoeletronico.repository.ObraRepository;
import com.obra.pontoeletronico.domain.Funcionario;
import com.obra.pontoeletronico.domain.Obra;
import com.obra.pontoeletronico.domain.RegistroPonto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistroPontoService {

    private final RegistroPontoRepository registroPontoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final ObraRepository obraRepository;
    private static final double RAIO_MAXIMO_METROS = 100.0;

    public RegistroPonto registrarPonto(Long funcionarioId, Long obraId, 
            RegistroPonto.TipoRegistro tipo, double latitude, double longitude) {
        
        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
            .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));
        
        Obra obra = obraRepository.findById(obraId)
            .orElseThrow(() -> new IllegalArgumentException("Obra não encontrada"));
        
        double distancia = calcularDistancia(latitude, longitude, obra.getLatitude(), obra.getLongitude());
        
        if (distancia > RAIO_MAXIMO_METROS) {
            throw new IllegalStateException("Funcionário está fora do raio permitido da obra");
        }

        RegistroPonto registro = new RegistroPonto();
        registro.setFuncionario(funcionario);
        registro.setObra(obra);
        registro.setTipo(tipo);
        registro.setDataHora(LocalDateTime.now());
        registro.setLatitude(latitude);
        registro.setLongitude(longitude);
        registro.setDentroDoRaio(true);
        registro.setRegistroManual(false);
        registro.setDistanciaObra(distancia);

        return registroPontoRepository.save(registro);
    }

    public RegistroPonto registrarPontoManual(Long funcionarioId, Long obraId, 
            RegistroPonto.TipoRegistro tipo, LocalDateTime dataHora, String observacao) {
        
        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
            .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));
        
        Obra obra = obraRepository.findById(obraId)
            .orElseThrow(() -> new IllegalArgumentException("Obra não encontrada"));
        
        RegistroPonto registro = new RegistroPonto();
        registro.setFuncionario(funcionario);
        registro.setObra(obra);
        registro.setTipo(tipo);
        registro.setDataHora(dataHora);
        registro.setLatitude(obra.getLatitude());
        registro.setLongitude(obra.getLongitude());
        registro.setDentroDoRaio(true);
        registro.setRegistroManual(true);
        registro.setObservacao(observacao);
        registro.setDistanciaObra(0.0);

        return registroPontoRepository.save(registro);
    }

    public List<RegistroPonto> buscarRegistrosPorPeriodo(Long funcionarioId, 
            LocalDateTime inicio, LocalDateTime fim) {
        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
            .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));
            
        return registroPontoRepository.findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(funcionario, inicio, fim);
    }

    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Raio da Terra em metros

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distância em metros
    }
} 