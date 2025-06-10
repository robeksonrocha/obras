package com.obra.pontoeletronico.domain.service;

import com.obra.pontoeletronico.domain.model.Usuario;
import com.obra.pontoeletronico.domain.port.in.UsuarioUseCase;
import com.obra.pontoeletronico.domain.port.out.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UsuarioUseCase {
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public Usuario criarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional
    public Usuario atualizarUsuario(Long id, Usuario usuario) {
        return usuarioRepository.findById(id)
            .map(usuarioExistente -> {
                usuario.setId(id);
                return usuarioRepository.save(usuario);
            })
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Override
    @Transactional
    public void deletarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }
} 