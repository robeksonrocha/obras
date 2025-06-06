package com.obra.pontoeletronico.dto;

import com.obra.pontoeletronico.domain.Usuario.Perfil;
import lombok.Data;

@Data
public class TokenDTO {
    private String token;
    private Long id;
    private String nome;
    private Perfil perfil;
} 