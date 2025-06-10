package com.obra.pontoeletronico.domain.port.in;

import com.obra.pontoeletronico.domain.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioUseCase {
    Usuario criarUsuario(Usuario usuario);
    Optional<Usuario> buscarUsuarioPorId(Long id);
    List<Usuario> listarUsuarios();
    Usuario atualizarUsuario(Long id, Usuario usuario);
    void deletarUsuario(Long id);
} 