package com.obra.pontoeletronico.domain.service;

import com.obra.pontoeletronico.domain.model.Usuario;
import com.obra.pontoeletronico.domain.port.in.AuthUseCase;
import com.obra.pontoeletronico.domain.port.out.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthUseCase {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public String login(String email, String senha) {
        return usuarioRepository.findByEmail(email)
            .filter(usuario -> passwordEncoder.matches(senha, usuario.getSenha()))
            .map(usuario -> {
                // TODO: Implementar geração de JWT
                return "token-jwt";
            })
            .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));
    }
    
    @Override
    @Transactional
    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }
    
    @Override
    @Transactional
    public void logout(String token) {
        // TODO: Implementar invalidação de token
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean validarToken(String token) {
        // TODO: Implementar validação de JWT
        return true;
    }
} 