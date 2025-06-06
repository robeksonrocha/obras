package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.domain.Usuario;
import com.obra.pontoeletronico.dto.LoginDTO;
import com.obra.pontoeletronico.dto.TokenDTO;
import com.obra.pontoeletronico.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody LoginDTO loginDTO) {
        log.info("Tentativa de login para o usuário: {}", loginDTO.getEmail());
        try {
            TokenDTO token = authService.login(loginDTO);
            log.info("Login bem-sucedido para o usuário: {}", loginDTO.getEmail());
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            log.error("Erro no login para o usuário: {}", loginDTO.getEmail(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        log.info("Tentativa de registro para o usuário: {}", usuario.getEmail());
        try {
            Usuario novoUsuario = authService.registrar(usuario);
            log.info("Registro bem-sucedido para o usuário: {}", usuario.getEmail());
            return ResponseEntity.ok(novoUsuario);
        } catch (Exception e) {
            log.error("Erro no registro para o usuário: {}", usuario.getEmail(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> optionsLogin() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/registrar", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> optionsRegistrar() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@RequestBody Map<String, String> request) {
        try {
            log.info("Tentativa de troca de senha para usuário: {}", request.get("email"));
            authService.trocarSenha(request.get("email"), request.get("senhaAtual"), request.get("novaSenha"));
            log.info("Senha alterada com sucesso para usuário: {}", request.get("email"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erro na troca de senha para usuário: {}", request.get("email"), e);
            return ResponseEntity.badRequest().build();
        }
    }
} 