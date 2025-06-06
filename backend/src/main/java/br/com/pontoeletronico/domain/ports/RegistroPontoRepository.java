package br.com.pontoeletronico.domain.ports;

import br.com.pontoeletronico.domain.model.RegistroPonto;
import br.com.pontoeletronico.domain.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RegistroPontoRepository {
    RegistroPonto save(RegistroPonto registroPonto);
    Optional<RegistroPonto> findById(Long id);
    List<RegistroPonto> findByUsuarioAndDataHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fim);
    List<RegistroPonto> findByUsuario(Usuario usuario);
    void delete(RegistroPonto registroPonto);
} 