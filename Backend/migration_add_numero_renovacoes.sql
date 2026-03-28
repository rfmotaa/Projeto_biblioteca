-- Migration: Adicionar coluna numero_renovacoes na tabela emprestimo
-- Data: 2026-03-27
-- Descrição: Adicionar contador de renovações para implementar limite máximo de 2 renovações

-- Adicionar coluna numero_renovacoes com valor padrão 0
ALTER TABLE emprestimo ADD COLUMN numero_renovacoes INT DEFAULT 0;

-- Verificar a alteração
SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'emprestimo' AND COLUMN_NAME = 'numero_renovacoes';

-- NOTA: Se o Hibernate estiver configurado com spring.jpa.hibernate.ddl-auto=update,
-- a coluna será criada automaticamente na inicialização da aplicação.
-- Caso contrário, execute este script manualmente no banco de dados.
