-- ============================================================
-- MIGRATION: Refatoração da Entidade Livro
-- Data: 2025-03-27
-- Descrição: Adicionar campos ISBN, editora, edição, autor e categorias
-- ============================================================

-- Adicionar novos campos à tabela livro
ALTER TABLE livro ADD COLUMN isbn VARCHAR(20) UNIQUE AFTER titulo;
ALTER TABLE livro ADD COLUMN editora VARCHAR(100) AFTER isbn;
ALTER TABLE livro ADD COLUMN edicao INT DEFAULT 1 AFTER editora;
ALTER TABLE livro ADD COLUMN autor VARCHAR(100) NOT NULL DEFAULT 'Autor Desconhecido' AFTER edicao;

-- Atualizar registros existentes com valores padrão
UPDATE livro SET autor = 'Autor Desconhecido' WHERE autor IS NULL OR autor = '';
UPDATE livro SET edicao = 1 WHERE edicao IS NULL;

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de relacionamento livro_categoria
CREATE TABLE IF NOT EXISTS livro_categoria (
    id_livro INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_livro, id_categoria),
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir categorias padrão
INSERT INTO categoria (nome) VALUES
('Ficção Científica'),
('Romance'),
('Drama'),
('Fantasia'),
('Mistério'),
('Terror'),
('Aventura'),
('Biografia'),
('História'),
('Ciência'),
('Técnico'),
('Infantil'),
('Juvenil'),
('Poesia'),
('Arte'),
('Outros')
ON DUPLICATE KEY UPDATE nome=VALUES(nome);

-- Criar índices para performance
CREATE INDEX idx_livro_autor ON livro(autor);
CREATE INDEX idx_livro_editora ON livro(editora);
CREATE INDEX idx_livro_isbn ON livro(isbn);
CREATE INDEX idx_livro_categoria_livro ON livro_categoria(id_livro);
CREATE INDEX idx_livro_categoria_categoria ON livro_categoria(id_categoria);

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

-- Verificar estrutura da tabela livro
-- DESCRIBE livro;

-- Verificar categorias inseridas
-- SELECT * FROM categoria;

-- Verificar contagem de livros
-- SELECT COUNT(*) as total_livros FROM livro;
