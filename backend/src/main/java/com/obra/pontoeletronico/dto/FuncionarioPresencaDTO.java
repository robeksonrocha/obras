package com.obra.pontoeletronico.dto;

import lombok.Data;

@Data
public class FuncionarioPresencaDTO {
    private Long id;
    private String nome;
    private String cargo;
    private String status;
    private String obraNome;
} 