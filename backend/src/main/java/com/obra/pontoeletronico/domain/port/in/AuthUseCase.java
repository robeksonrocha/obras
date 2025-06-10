package com.obra.pontoeletronico.domain.port.in;

import com.obra.pontoeletronico.domain.model.Usuario;

public interface AuthUseCase {
    String login(String email, String senha);
    Usuario registrar(Usuario usuario);
    void logout(String token);
    boolean validarToken(String token);
} 