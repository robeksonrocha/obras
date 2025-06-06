package com.obra.pontoeletronico.service;

import com.obra.pontoeletronico.adapter.out.persistence.UsuarioRepository;
import com.obra.pontoeletronico.domain.Usuario;
import com.obra.pontoeletronico.dto.LoginDTO;
import com.obra.pontoeletronico.dto.TokenDTO;
import com.obra.pontoeletronico.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> {
                    throw new UsernameNotFoundException("Usuário não encontrado");
                });
        return usuario;
    }

    public TokenDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getSenha())
        );

        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.isAtivo()) {
            throw new RuntimeException("Usuário inativo");
        }

        String token = tokenProvider.generateToken(authentication);

        TokenDTO tokenDTO = new TokenDTO();
        tokenDTO.setToken(token);
        tokenDTO.setId(usuario.getId());
        tokenDTO.setNome(usuario.getNome());
        tokenDTO.setPerfil(usuario.getPerfil());

        return tokenDTO;
    }

    public boolean validarToken(String token) {
        return tokenProvider.validateToken(token);
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getPassword()));
        var usuarioSalvo = usuarioRepository.save(usuario);
        return usuarioSalvo;
    }

    public TokenDTO autenticar(LoginDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));

        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getPassword())) {
            throw new BadCredentialsException("Senha inválida");
        }

        if (!usuario.isEnabled()) {
            throw new BadCredentialsException("Usuário inativo");
        }

        String token = jwtService.generateToken(usuario);
        TokenDTO tokenDTO = new TokenDTO();
        tokenDTO.setToken(token);
        tokenDTO.setId(usuario.getId());
        tokenDTO.setNome(usuario.getNome());
        tokenDTO.setPerfil(usuario.getPerfil());

        return tokenDTO;
    }

    public void trocarSenha(String email, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));

        if (!passwordEncoder.matches(senhaAtual, usuario.getPassword())) {
            throw new BadCredentialsException("Senha atual inválida");
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }
} 