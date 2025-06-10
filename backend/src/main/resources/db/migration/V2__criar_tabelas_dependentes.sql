-- Criação da tabela de funcionários
CREATE TABLE funcionarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    obra_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_funcionario_obra FOREIGN KEY (obra_id) REFERENCES obras(id),
    CONSTRAINT fk_funcionario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Criação da tabela de registros de ponto
CREATE TABLE registros_ponto (
    id BIGSERIAL PRIMARY KEY,
    funcionario_id BIGINT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    tipo_registro VARCHAR(20) NOT NULL,
    observacao TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_registro_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- Criação da tabela de justificativas
CREATE TABLE justificativas (
    id BIGSERIAL PRIMARY KEY,
    funcionario_id BIGINT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    motivo TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    aprovado_por BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_justificativa_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
    CONSTRAINT fk_justificativa_usuario FOREIGN KEY (aprovado_por) REFERENCES usuarios(id)
);

-- Criação da tabela de configurações de horário
CREATE TABLE configuracoes_horario (
    id BIGSERIAL PRIMARY KEY,
    obra_id BIGINT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    tolerancia_minutos INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_configuracao_obra FOREIGN KEY (obra_id) REFERENCES obras(id)
); 