package com.obra.pontoeletronico.dto;

import lombok.Data;

@Data
public class ObraResumoDTO {
    private Long id;
    private String nome;
    private int totalFuncionarios;
    private long registrosHoje;
} 