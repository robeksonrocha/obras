CREATE TABLE obras (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    observacoes TEXT
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    pin VARCHAR(6) UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_roles (
    usuario_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    PRIMARY KEY (usuario_id, role)
);

CREATE TABLE registros_ponto (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    obra_id BIGINT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    registro_manual BOOLEAN NOT NULL DEFAULT FALSE,
    observacao TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (obra_id) REFERENCES obras(id)
);

-- Inserir usuário admin padrão
INSERT INTO usuarios (nome, email, senha, ativo)
VALUES ('Administrador', 'admin@admin.com', '$2a$10$Y50UaMFOxteJQHw5B0Z8Ye3CrdqvTGa..RVxnCHS1KH6YwXrvKqyi', true); -- Senha: admin123

INSERT INTO usuario_roles (usuario_id, role)
VALUES (1, 'ROLE_ADMIN');

-- Inserir uma obra exemplo
INSERT INTO obras (nome, endereco, latitude, longitude, ativa)
VALUES ('Obra Exemplo', 'Rua Exemplo, 123', -23.550520, -46.633308, true); 