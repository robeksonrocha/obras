-- Criação da tabela de feriados
CREATE TABLE feriados (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de logs de sistema
CREATE TABLE logs_sistema (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Índices para melhorar performance
CREATE INDEX idx_funcionarios_obra_id ON funcionarios(obra_id);
CREATE INDEX idx_funcionarios_usuario_id ON funcionarios(usuario_id);
CREATE INDEX idx_registros_ponto_funcionario_id ON registros_ponto(funcionario_id);
CREATE INDEX idx_registros_ponto_data_hora ON registros_ponto(data_hora);
CREATE INDEX idx_justificativas_funcionario_id ON justificativas(funcionario_id);
CREATE INDEX idx_justificativas_status ON justificativas(status);
CREATE INDEX idx_configuracoes_horario_obra_id ON configuracoes_horario(obra_id);
CREATE INDEX idx_logs_sistema_usuario_id ON logs_sistema(usuario_id);
CREATE INDEX idx_logs_sistema_created_at ON logs_sistema(created_at); 