package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.model.Usuario;
import com.obra.pontoeletronico.domain.port.out.UsuarioRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JpaUsuarioRepository extends JpaRepository<Usuario, Long>, UsuarioRepository {
    Optional<Usuario> findByEmail(String email);
} 