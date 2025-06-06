package com.obra.pontoeletronico.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardDTO {
    private long totalFuncionarios;
    private long totalObrasAtivas;
    private long registrosHoje;
    private long totalAlertas;
    private List<RegistroPontoResumoDTO> ultimosRegistros;
    private List<ObraResumoDTO> obrasComMaisFuncionarios;
    private List<FuncionarioPresencaDTO> presencaFuncionarios;
}


