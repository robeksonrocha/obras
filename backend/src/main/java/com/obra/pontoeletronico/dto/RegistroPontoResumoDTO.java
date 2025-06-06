package com.obra.pontoeletronico.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistroPontoResumoDTO {
    private Long id;
    private String funcionarioNome;
    private String obraNome;
    private String tipo;
    private LocalDateTime dataHora;
    private boolean dentroDoRaio;
} 