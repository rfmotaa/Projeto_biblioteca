-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Biblioteca
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Biblioteca
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Biblioteca` DEFAULT CHARACTER SET utf8 ;
USE `Biblioteca` ;

-- -----------------------------------------------------
-- Table `Biblioteca`.`livro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Biblioteca`.`livro` (
  `id_livro` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(127) NOT NULL,
  `ano_publicacao` SMALLINT(4) NOT NULL,
  `qnt_total` SMALLINT(4) NOT NULL DEFAULT 1,
  `qnt_disponivel` SMALLINT(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_livro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Biblioteca`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Biblioteca`.`cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(127) NOT NULL,
  `email` VARCHAR(127) NOT NULL,
  `status` ENUM("ativo", "bloqueado") NOT NULL,
  `senha_hash` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `senha_hash_UNIQUE` (`senha_hash` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Biblioteca`.`emprestimo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Biblioteca`.`emprestimo` (
  `id_emprestimo` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `id_livro` INT NOT NULL,
  `data_retirada` DATE NOT NULL,
  `data_retorno_previsto` DATE NOT NULL,
  `data_retorno_oficial` DATE NULL,
  PRIMARY KEY (`id_emprestimo`),
  INDEX `id_cliente_idx` (`id_cliente` ASC) VISIBLE,
  INDEX `id_livro_idx` (`id_livro` ASC) VISIBLE,
  CONSTRAINT `id_cliente`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `Biblioteca`.`cliente` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_livro`
    FOREIGN KEY (`id_livro`)
    REFERENCES `Biblioteca`.`livro` (`id_livro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Biblioteca`.`funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Biblioteca`.`funcionario` (
  `id_funcionario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(127) NOT NULL,
  `login` VARCHAR(45) NOT NULL,
  `senha_hash` VARCHAR(127) NOT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Povoamento das tabelas
-- Seleciona o banco de dados para garantir que os comandos sejam executados no lugar certo.
USE `Biblioteca`;

-- Remove a proteção contra deleções/atualizações sem cláusula WHERE, facilitando a limpeza se necessário.
-- SET SQL_SAFE_UPDATES = 0;

-- Limpa as tabelas na ordem correta para evitar erros de chave estrangeira antes de inserir novos dados.
-- Descomente as linhas abaixo se quiser limpar o banco antes de popular.
-- DELETE FROM emprestimo;
-- DELETE FROM funcionario;
-- DELETE FROM cliente;
-- DELETE FROM livro;

-- -----------------------------------------------------
-- Povoando a tabela `livro`
-- -----------------------------------------------------
INSERT INTO `livro` (titulo, ano_publicacao, qnt_total, qnt_disponivel) VALUES
('O Senhor dos Anéis: A Sociedade do Anel', 1954, 3, 2),
('1984', 1949, 5, 5),
('Dom Casmurro', 1899, 4, 3),
('A Revolução dos Bichos', 1945, 2, 2),
('O Guia do Mochileiro das Galáxias', 1979, 3, 3);

-- -----------------------------------------------------
-- Povoando a tabela `cliente`
-- Para testar o login, use a senha correspondente (ex: 'senha123').
-- Seu backend precisa hashear a senha digitada para comparar com o hash salvo.
-- -----------------------------------------------------
INSERT INTO `cliente` (nome, email, status, senha_hash) VALUES
('Ana Silva', 'ana@email.com', 'ativo', 'senha123'),
('Bruno Costa', 'bruno@email.com', 'ativo', 'senha456'),
('Carla Dias', 'carla@email.com', 'bloqueado', 'senha789');

-- -----------------------------------------------------
-- Povoando a tabela `funcionario`
-- Para testar o login, use login 'admin' e senha 'admin123'.
-- -----------------------------------------------------
INSERT INTO `funcionario` (nome, login, senha_hash) VALUES
('Admin User', 'admin', 'admin123');

-- -----------------------------------------------------
-- Povoando a tabela `emprestimo`
-- Relaciona os clientes e livros criados acima.
-- -----------------------------------------------------
INSERT INTO `emprestimo` (id_cliente, id_livro, data_retirada, data_retorno_previsto, data_retorno_oficial) VALUES
-- Empréstimo ativo (Ana pegou 'O Senhor dos Anéis')
(1, 1, '2025-10-05', '2025-10-19', NULL),
-- Empréstimo já finalizado (Bruno pegou 'Dom Casmurro')
(2, 3, '2025-09-10', '2025-09-24', '2025-09-22'),
-- Outro empréstimo ativo (Ana pegou 'Dom Casmurro' também)
(1, 3, '2025-10-15', '2025-10-29', NULL);


-- Confirma as transações
COMMIT;
