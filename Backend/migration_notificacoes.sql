-- Migration: Sistema de Notificações e Lista de Interesse
-- Data: 2026-03-27
-- Descrição: Cria tabelas para notificações e lista de interesse dos clientes

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacao (
    id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    mensagem VARCHAR(500) NOT NULL,
    tipo_notificacao VARCHAR(50) NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_livro INT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro) ON DELETE SET NULL,
    INDEX idx_notificacao_cliente_lida (id_cliente, lida),
    INDEX idx_notificacao_cliente_data (id_cliente, data_criacao DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de interesses
CREATE TABLE IF NOT EXISTS livro_interesse (
    id_interesse INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_livro INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_cliente_livro (id_cliente, id_livro),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro) ON DELETE CASCADE,
    INDEX idx_interesse_cliente (id_cliente),
    INDEX idx_interesse_livro (id_livro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
