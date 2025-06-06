package br.com.pontoeletronico.infrastructure.persistence;

import br.com.pontoeletronico.domain.model.RegistroPonto;
import br.com.pontoeletronico.domain.model.Usuario;
import br.com.pontoeletronico.domain.ports.RegistroPontoRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JpaRegistroPontoRepository extends JpaRepository<RegistroPonto, Long>, RegistroPontoRepository {
    List<RegistroPonto> findByUsuarioAndDataHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fim);
    List<RegistroPonto> findByUsuario(Usuario usuario);
} 