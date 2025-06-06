package br.com.pontoeletronico.domain.ports;

import br.com.pontoeletronico.domain.model.Usuario;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository {
    Usuario save(Usuario usuario);
    Optional<Usuario> findById(Long id);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByPin(String pin);
    List<Usuario> findAll();
    void delete(Usuario usuario);
    boolean existsByEmail(String email);
    boolean existsByPin(String pin);
} 