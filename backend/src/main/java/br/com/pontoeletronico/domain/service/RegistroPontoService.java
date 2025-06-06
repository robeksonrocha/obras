package br.com.pontoeletronico.domain.service;

import br.com.pontoeletronico.domain.model.RegistroPonto;
import br.com.pontoeletronico.domain.model.Usuario;
import br.com.pontoeletronico.domain.model.Obra;
import br.com.pontoeletronico.domain.ports.RegistroPontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistroPontoService {

    private final RegistroPontoRepository registroPontoRepository;
    
    @Transactional
    public RegistroPonto registrarPonto(Usuario usuario, Obra obra, RegistroPonto.TipoRegistro tipo, 
                                      Double latitude, Double longitude) {
        validarLocalizacao(obra, latitude, longitude);
        
        RegistroPonto registroPonto = new RegistroPonto();
        registroPonto.setUsuario(usuario);
        registroPonto.setObra(obra);
        registroPonto.setTipo(tipo);
        registroPonto.setDataHora(LocalDateTime.now());
        registroPonto.setLatitude(latitude);
        registroPonto.setLongitude(longitude);
        registroPonto.setRegistroManual(false);
        
        return registroPontoRepository.save(registroPonto);
    }
    
    @Transactional
    public RegistroPonto registrarPontoManual(Usuario usuario, Obra obra, RegistroPonto.TipoRegistro tipo,
                                            LocalDateTime dataHora, String observacao) {
        RegistroPonto registroPonto = new RegistroPonto();
        registroPonto.setUsuario(usuario);
        registroPonto.setObra(obra);
        registroPonto.setTipo(tipo);
        registroPonto.setDataHora(dataHora);
        registroPonto.setLatitude(obra.getLatitude());
        registroPonto.setLongitude(obra.getLongitude());
        registroPonto.setRegistroManual(true);
        registroPonto.setObservacao(observacao);
        
        return registroPontoRepository.save(registroPonto);
    }
    
    public List<RegistroPonto> buscarRegistrosPorPeriodo(Usuario usuario, LocalDateTime inicio, LocalDateTime fim) {
        return registroPontoRepository.findByUsuarioAndDataHoraBetween(usuario, inicio, fim);
    }
    
    private void validarLocalizacao(Obra obra, Double latitude, Double longitude) {
        double distancia = calcularDistancia(
            obra.getLatitude(), obra.getLongitude(),
            latitude, longitude
        );
        
        if (distancia > 100) { // 100 metros de distância máxima
            throw new IllegalStateException("Localização muito distante da obra");
        }
    }
    
    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Raio da Terra em metros
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
} 