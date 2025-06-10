package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.domain.port.in.AuthUseCase;
import com.obra.pontoeletronico.adapter.in.web.request.LoginRequest;
import com.obra.pontoeletronico.adapter.in.web.request.RegisterRequest;
import com.obra.pontoeletronico.adapter.in.web.response.AuthResponse;
import com.obra.pontoeletronico.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        String token = authUseCase.login(loginRequest.email(), loginRequest.senha());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody RegisterRequest registerRequest) {
        Usuario novoUsuario = Usuario.builder()
                .nome(registerRequest.nome())
                .email(registerRequest.email())
                .senha(registerRequest.senha())
                .role(registerRequest.role())
                .ativo(true)
                .build();
        Usuario usuarioRegistrado = authUseCase.registrar(novoUsuario);
        return ResponseEntity.ok(usuarioRegistrado);
    }

    // TODO: Implementar endpoint de logout e validação de token, se necessário para a arquitetura
} 