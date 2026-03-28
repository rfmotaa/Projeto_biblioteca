-- ============================================================================
-- MOCK BANCO DE DADOS - SISTEMA BIBLIOTECA
-- Data: 27/03/2026
-- Descrição: Dados realistas para teste completo do sistema
-- ============================================================================

-- ============================================================================
-- LIMPEZA DE DADOS EXISTENTES
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE notificacao;
TRUNCATE TABLE livro_interesse;
TRUNCATE TABLE emprestimo;
TRUNCATE TABLE livro_categoria;
TRUNCATE TABLE livro;
TRUNCATE TABLE cliente;
TRUNCATE TABLE funcionario;
TRUNCATE TABLE categoria;

TRUNCATE TABLE notificacao;
TRUNCATE TABLE livro_interesse;
TRUNCATE TABLE emprestimo;
TRUNCATE TABLE livro_categoria;
TRUNCATE TABLE livro;
TRUNCATE TABLE cliente;
TRUNCATE TABLE funcionario;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. INSERIR FUNCIONÁRIOS (ADMINISTRADORES)
-- ============================================================================
-- Senha: "admin123" para todos (hash simulado - em produção usar BCrypt)
INSERT INTO funcionario (nome, login, senha_hash) VALUES
('Carlos Eduardo Silva', 'carlos.admin', 'admin123'),
('Ana Paula Santos', 'ana.admin', 'admin234'),
('Roberto Ferreira', 'roberto.admin', 'admin345'),
('Mariana Costa', 'mariana.admin', 'admin456'),
('Pedro Henrique Lima', 'pedro.admin', 'admin567'),
('Juliana Mendes', 'juliana.admin', 'admin678'),
('Lucas Oliveira', 'lucas.admin', 'admin789'),
('Fernanda Souza', 'fernanda.admin', 'admin890'),
('Ricardo Alves', 'ricardo.admin', 'admin901'),
('Patricia Gonçalves', 'patricia.admin', 'admin012');

-- ============================================================================
-- 2. INSERIR CLIENTES
-- ============================================================================
INSERT INTO cliente (nome, email, senha_hash, status) VALUES
-- Clientes ATIVOS
('João Victor Martins', 'joao.martins@email.com', 'cli123', 'ativo'),
('Maria Luiza Pereira', 'maria.pereira@email.com', 'cli234', 'ativo'),
('Pedro Almeida', 'pedro.almeida@email.com', 'cli345', 'ativo'),
('Ana Clara Rodrigues', 'ana.rodrigues@email.com', 'cli456', 'ativo'),
('Lucas Fernandes', 'lucas.fernandes@email.com', 'cli567', 'ativo'),
('Juliana Castro', 'juliana.castro@email.com', 'cli678', 'ativo'),
('Rafael Barros', 'rafael.barros@email.com', 'cli789', 'ativo'),
('Beatriz Nunes', 'beatriz.nunes@email.com', 'cli890', 'ativo'),
('Gabriel Lima', 'gabriel.lima@email.com', 'cli901', 'ativo'),
('Larissa Moreira', 'larissa.moreira@email.com', 'cli012', 'ativo'),
('Bruno Cardoso', 'bruno.cardoso@email.com', 'cli235', 'ativo'),
('Camila Peixoto', 'camila.peixoto@email.com', 'cli356', 'ativo'),
('Diego Ribeiro', 'diego.ribeiro@email.com', 'cli467', 'ativo'),
('Aline Pinto', 'aline.pinto@email.com', 'cli578', 'ativo'),
('Felipe Guedes', 'felipe.guedes@email.com', 'cli689', 'ativo'),
('Gabriela Correia', 'gabriela.correia@email.com', 'cli790', 'ativo'),
('Thiago Borges', 'thiago.borges@email.com', 'cli801', 'ativo'),
('Renata Farias', 'renata.farias@email.com', 'cli912', 'ativo'),
('Leandro Duarte', 'leandro.duarte@email.com', 'cli023', 'ativo'),
('Vanessa Campos', 'vanessa.campos@email.com', 'cli134', 'ativo'),

-- Clientes BLOQUEADOS (para testes)
('Marcos Antonio', 'marcos.bloqueado@email.com', 'cli245', 'bloqueado'),
('Carla Daniela', 'carla.bloqueado@email.com', 'cli356', 'bloqueado'),

-- Clientes com histórico de empréstimos
('André Luis', 'andre.luis@email.com', 'cli467', 'ativo'),
('Mariana Cláudia', 'mariana.claudia@email.com', 'cli578', 'ativo'),
('Sergio Roberto', 'sergio.roberto@email.com', 'cli689', 'ativo'),
('Regina Silva', 'regina.silva@email.com', 'cli790', 'ativo'),
('Horacio Nunes', 'horacio.nunes@email.com', 'cli801', 'ativo'),
('Elaine Costa', 'elaine.costa@email.com', 'cli912', 'ativo'),
('Vitor Hugo', 'vitor.hugo@email.com', 'cli023', 'ativo'),
('Cristina Arantes', 'cristina.arantes@email.com', 'cli134', 'ativo');

-- ============================================================================
-- 3. INSERIR CATEGORIAS
-- ============================================================================
INSERT INTO categoria (nome, data_criacao) VALUES
('Ficção Científica', '2026-01-01 10:00:00'),
('Romance', '2026-01-01 10:00:00'),
('Drama', '2026-01-01 10:00:00'),
('Fantasia', '2026-01-01 10:00:00'),
('Mistério', '2026-01-01 10:00:00'),
('Terror', '2026-01-01 10:00:00'),
('Aventura', '2026-01-01 10:00:00'),
('Biografia', '2026-01-01 10:00:00'),
('História', '2026-01-01 10:00:00'),
('Ciência', '2026-01-01 10:00:00'),
('Técnico', '2026-01-01 10:00:00'),
('Infantil', '2026-01-01 10:00:00'),
('Juvenil', '2026-01-01 10:00:00'),
('Poesia', '2026-01-01 10:00:00'),
('Arte', '2026-01-01 10:00:00'),
('Outros', '2026-01-01 10:00:00');

-- ============================================================================
-- 4. INSERIR LIVROS
-- ============================================================================
INSERT INTO livro (titulo, isbn, editora, edicao, autor, ano_publicacao, qnt_total, qnt_disponivel) VALUES
-- FICÇÃO CIENTÍFICA
('Duna', '9788576579513', 'Aleph', 1, 'Frank Herbert', 1965, 5, 3),
('Neuromante', '9788577425115', 'Aleph', 1, 'William Gibson', 1984, 3, 2),
('Fundação', '9788576574358', 'Aleph', 1, 'Isaac Asimov', 1951, 4, 4),
('O Guia do Mochileiro das Galáxias', '9788576574167', 'Aleph', 1, 'Douglas Adams', 1979, 3, 1),
('Admirável Mundo Novo', '9788525046344', 'Globo', 1, 'Aldous Huxley', 1932, 4, 2),
('1984', '9788576574539', 'Companhia das Letras', 1, 'George Orwell', 1949, 5, 3),

-- FANTASIA
('O Senhor dos Anéis: A Sociedade do Anel', '9788578270385', 'Martins Fontes', 1, 'J.R.R. Tolkien', 1954, 6, 4),
('Harry Potter e a Pedra Filosofal', '9788532510294', 'Rocco', 1, 'J.K. Rowling', 1997, 8, 5),
('O Hobbit', '9788578270859', 'Martins Fontes', 1, 'J.R.R. Tolkien', 1937, 5, 3),
('As Crônicas de Nárnia: O Leão, a Feiticeira e o Guarda-Roupa', '9788573665836', 'WMF Martins Fontes', 1, 'C.S. Lewis', 1950, 4, 2),
('Jogos Vorazes', '9788539023660', 'Rocco', 1, 'Suzanne Collins', 2008, 5, 4),
('A Guerra dos Tronos', '9788565769069', 'Leya', 1, 'George R.R. Martin', 1996, 4, 1),

-- ROMANCE
('Orgulho e Preconceito', '9788535904131', 'Martin Claret', 1, 'Jane Austen', 1813, 4, 3),
('Jane Eyre', '9788535910170', 'Penguin Companhia', 1, 'Charlotte Brontë', 1847, 3, 2),
('O Amor nos Tempos do Cólera', '9788535910965', 'Companhia das Letras', 1, 'Gabriel García Márquez', 1985, 3, 1),
('Como Água para Chocolate', '9788520920855', 'Rocco', 1, 'Laura Esquivel', 1989, 2, 2),
('Emma', '9788535910187', 'Penguin Companhia', 1, 'Jane Austen', 1815, 2, 1),

-- DRAMA
('A Culpa é das Estrelas', '9788580415419', 'Intrínseca', 1, 'John Green', 2012, 5, 3),
('A Menina que Roubava Livros', '9788539004114', 'Record', 1, 'Markus Zusak', 2005, 4, 2),
('A Lista', '9788542200755', 'Paralela', 1, 'Siobhan Vivian', 2012, 3, 1),
('O Fantasma da Ópera', '9788576574129', 'Martin Claret', 1, 'Gaston Leroux', 1910, 2, 0),
('Romeu e Julieta', '9788571648632', 'Penguin Companhia', 1, 'William Shakespeare', 1597, 3, 2),

-- MISTÉRIO
('O Cão dos Baskerville', '9788576574174', 'Martin Claret', 1, 'Arthur Conan Doyle', 1902, 4, 3),
('Murder on the Orient Express', '9788576579858', 'HarperCollins', 1, 'Agatha Christie', 1934, 3, 2),
('O Código Da Vinci', '9788576552104', 'Sextante', 1, 'Dan Brown', 2003, 5, 4),
('Garota Exemplar', '9788576838956', 'Verus', 1, 'Gillian Flynn', 2012, 4, 2),
('A Sombra do Vento', '9788535910743', 'Companhia das Letras', 2001, 1, 'Carlos Ruiz Zafón', 2001, 3, 1),

-- TERROR
('It: A Coisa', '9788576579650', 'Suma', 1, 'Stephen King', 1986, 4, 2),
('O Iluminado', '9788580579373', 'Objetiva', 1, 'Stephen King', 1977, 3, 1),
('Frankenstein', '9788576573993', 'Martin Claret', 1, 'Mary Shelley', 1818, 2, 1),
('Drácula', '9788576574266', 'Martin Claret', 1, 'Bram Stoker', 1897, 3, 2),
('O Exorcista', '9788576576847', 'Rocco', 1, 'William Peter Blatty', 1971, 2, 0),

-- AVENTURA
('As Crônicas de Narnia: Príncipe Caspian', '9788573665621', 'WMF Martins Fontes', 1, 'C.S. Lewis', 1951, 3, 2),
('A Ilha do Tesouro', '9788576573105', 'Martin Claret', 1, 'Robert Louis Stevenson', 1883, 4, 3),
('Robinson Crusoe', '9788576579466', 'Martin Claret', 1, 'Daniel Defoe', 1719, 2, 1),
('Três Homens em Um Barco', '9788578270897', 'Martins Fontes', 1, 'Jerome K. Jerome', 1889, 2, 2),

-- BIOGRAFIA
('Steve Jobs: A Biografia', '9788539004114', 'Companhia das Letras', 1, 'Walter Isaacson', 2011, 3, 2),
('Uma Breve História do Tempo', '9788535910972', 'Companhia das Letras', 1, 'Stephen Hawking', 1988, 4, 3),
('O Diário de Anne Frank', '9788535910851', 'Record', 1, 'Anne Frank', 1947, 5, 4),
('Longa Caminhada para a Liberdade', '9788535910934', 'Companhia das Letras', 1, 'Nelson Mandela', 1994, 3, 1),
('Einstein: Sua Vida, Seu Universo', '9788576573682', 'Sextante', 1, 'Walter Isaacson', 2007, 2, 2),

-- HISTÓRIA
('Sapiens: Uma Breve História da Humanidade', '9788539004114', 'L&PM', 1, 'Yuval Noah Harari', 2011, 4, 3),
('Os Guns Nães', '9788543104600', 'Planeta', 1, 'Laurent Binet', 2022, 3, 2),
('1408: O Ano que o Mundo Mudou', '9788576573651', 'Companhia das Letras', 1, 'Catherine Nixey', 2017, 2, 1),
('A Arte da Guerra', '9788576573378', 'Martin Claret', 1, 'Sun Tzu', -500, 5, 4),

-- CIÊNCIA
('Cosmos', '9788535910868', 'Companhia das Letras', 1, 'Carl Sagan', 1980, 3, 2),
('O Gene: Uma História Íntima', '9788535928109', 'Companhia das Letras', 1, 'Siddhartha Mukherjee', 2016, 2, 1),
('A Vida Secreta das Árvores', '9788543102910', 'Gutenberg', 1, 'Peter Wohlleben', 2015, 3, 3),
('Uma Breve História de Quase Tudo', '9788535910958', 'Companhia das Letras', 1, 'Bill Bryson', 2003, 4, 2),

-- TÉCNICO
('Clean Code: A Handbook of Agile Software Craftsmanship', '9788576573682', 'Alta Books', 1, 'Robert C. Martin', 2008, 3, 1),
('The Pragmatic Programmer', '9788576573989', 'Bookman', 1, 'Andrew Hunt', 1999, 2, 1),
('Introduction to Algorithms', '9788576573989', 'MIT Press', 3, 'Thomas H. Cormen', 2009, 2, 0),
('Design Patterns: Elements of Reusable Object-Oriented Software', '9788576573989', 'Addison-Wesley', 1, 'Erich Gamma', 1994, 2, 1),

-- INFANTIL
('O Pequeno Príncipe', '9788576574259', 'Agir', 1, 'Antoine de Saint-Exupéry', 1943, 6, 5),
('Alice no País das Maravilhas', '9788576573620', 'Martin Claret', 1, 'Lewis Carroll', 1865, 5, 4),
('O Mágico de Oz', '9788576573972', 'Martin Claret', 1, 'L. Frank Baum', 1900, 4, 3),
('Peter Pan', '9788576573835', 'Martin Claret', 1, 'J.M. Barrie', 1904, 3, 2),

-- JUVENIL
('A Culpa é das Estrelas', '9788580415419', 'Intrínseca', 1, 'John Green', 2012, 5, 3),
('Percy Jackson e o Ladrão de Raios', '9788538070684', 'Intrínseca', 1, 'Rick Riordan', 2005, 4, 3),
('Diário de um Banana', '9788599172979', 'VR', 1, 'Jeff Kinney', 2007, 6, 5),
('Cidades de Papel', '9788538070691', 'Intrínseca', 1, 'John Green', 2008, 4, 2),

-- POESIA
('Poesia Completa', '9788576573859', 'Martin Claret', 1, 'Fernando Pessoa', 1920, 2, 1),
('Antologia Poética', '9788576574245', 'Martin Claret', 1, 'Carlos Drummond de Andrade', 1930, 2, 2),
('Sonetos', '9788576573972', 'Martin Claret', 1, 'Vinicius de Moraes', 1950, 1, 1),

-- ARTE
('A História da Arte', '9788576573993', 'Phaidon', 1, 'E.H. Gombrich', 1950, 2, 1),
('Ways of Seeing', '9788576573993', 'Penguin', 1, 'John Berger', 1972, 1, 0);

-- ============================================================================
-- 5. INSERIR RELACIONAMENTO LIVRO-CATEGORIA
-- ============================================================================
-- Ficção Científica (1)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1);

-- Romance (2)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(26, 2), (27, 2), (28, 2), (29, 2), (30, 2);

-- Drama (3)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(31, 3), (32, 3), (33, 3), (34, 3), (35, 3), (45, 3);

-- Fantasia (4)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(7, 4), (8, 4), (9, 4), (10, 4), (11, 4), (12, 4);

-- Mistério (5)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(36, 5), (37, 5), (38, 5), (39, 5), (40, 5);

-- Terror (6)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(41, 6), (42, 6), (43, 6), (44, 6), (45, 6);

-- Aventura (7)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(46, 7), (47, 7), (48, 7), (49, 7), (10, 7);

-- Biografia (8)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(50, 8), (51, 8), (52, 8), (53, 8), (54, 8);

-- História (9)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(55, 9), (56, 9), (57, 9), (58, 9);

-- Ciência (10)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(59, 10), (60, 10), (61, 10), (62, 10), (51, 10);

-- Técnico (11)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(63, 11), (64, 11), (65, 11), (66, 11);

-- Infantil (12)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(67, 12), (68, 12), (69, 12), (70, 12), (8, 12);

-- Juvenil (13)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(45, 13), (31, 13), (71, 13), (72, 13), (73, 13), (74, 13);

-- Poesia (14)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(75, 14), (76, 14), (77, 14);

-- Arte (15)
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(78, 15), (79, 15);

-- Livros com múltiplas categorias
INSERT INTO livro_categoria (id_livro, id_categoria) VALUES
(1, 4), (7, 7), (8, 13), (12, 3), (31, 2);

-- ============================================================================
-- 6. INSERIR EMPRÉSTIMOS
-- ============================================================================
-- Empréstimos ATIVOS (livro com cliente)
INSERT INTO emprestimo (id_cliente, id_livro, data_retirada, data_retorno_previsto, data_retorno_oficial, status, numero_renovacoes) VALUES
(1, 1, '2026-03-20', '2026-04-03', NULL, 'ATIVO', 0),
(2, 7, '2026-03-22', '2026-04-05', NULL, 'ATIVO', 1),
(3, 8, '2026-03-25', '2026-04-08', NULL, 'ATIVO', 0),
(4, 31, '2026-03-15', '2026-03-29', NULL, 'ATIVO', 2),
(5, 38, '2026-03-18', '2026-04-01', NULL, 'ATIVO', 0);

-- Empréstimos FINALIZADOS
INSERT INTO emprestimo (id_cliente, id_livro, data_retirada, data_retorno_previsto, data_retorno_oficial, status, numero_renovacoes) VALUES
(6, 2, '2026-02-10', '2026-02-24', '2026-02-23', 'FINALIZADO', 1),
(7, 3, '2026-02-15', '2026-03-01', '2026-02-28', 'FINALIZADO', 0),
(8, 26, '2026-01-20', '2026-02-03', '2026-02-02', 'FINALIZADO', 2),
(9, 36, '2026-02-05', '2026-02-19', '2026-02-18', 'FINALIZADO', 0),
(10, 41, '2026-01-25', '2026-02-08', '2026-02-07', 'FINALIZADO', 1),
(11, 50, '2026-02-20', '2026-03-05', '2026-03-04', 'FINALIZADO', 0),
(12, 59, '2026-03-01', '2026-03-15', '2026-03-14', 'FINALIZADO', 2),
(13, 67, '2026-02-28', '2026-03-14', '2026-03-12', 'FINALIZADO', 1);

-- Empréstimos PENDENTES (aguardando aprovação)
INSERT INTO emprestimo (id_cliente, id_livro, data_retirada, data_retorno_previsto, data_retorno_oficial, status, numero_renovacoes) VALUES
(14, 4, '2026-03-26', '2026-04-09', NULL, 'PENDENTE', 0),
(15, 9, '2026-03-26', '2026-04-09', NULL, 'PENDENTE', 0),
(16, 32, '2026-03-26', '2026-04-09', NULL, 'PENDENTE', 0);

-- Empréstimos APROVADOS (aprovados mas ainda não retirados)
INSERT INTO emprestimo (id_cliente, id_livro, data_retirada, data_retorno_previsto, data_retorno_oficial, status, numero_renovacoes) VALUES
(17, 5, '2026-03-27', '2026-04-10', NULL, 'APROVADO', 0),
(18, 10, '2026-03-27', '2026-04-10', NULL, 'APROVADO', 0);

-- Empréstimos REJEITADOS
INSERT INTO emprestimo (id_cliente, id_livro, data_retirada, data_retorno_previsto, data_retorno_oficial, status, numero_renovacoes) VALUES
(19, 42, '2026-03-20', '2026-04-03', NULL, 'REJEITADO', 0),
(20, 43, '2026-03-22', '2026-04-05', NULL, 'REJEITADO', 0);

-- ============================================================================
-- 7. INSERIR LISTA DE INTERESSE
-- ============================================================================
INSERT INTO livro_interesse (id_cliente, id_livro, data_criacao) VALUES
-- Cliente 1 - Interessado em livros indisponíveis
(1, 42, '2026-03-25 10:30:00'),
(1, 45, '2026-03-25 11:00:00'),

-- Cliente 6 - Interessado em livros populares
(6, 1, '2026-03-20 14:00:00'),
(6, 7, '2026-03-21 09:30:00'),
(6, 8, '2026-03-22 16:45:00'),

-- Cliente 10 - Vários interesses
(10, 26, '2026-03-15 10:00:00'),
(10, 27, '2026-03-16 11:30:00'),
(10, 31, '2026-03-17 14:20:00'),

-- Cliente 14 - Interesses recentes
(14, 5, '2026-03-26 09:00:00'),
(14, 10, '2026-03-26 10:15:00'),

-- Cliente 21 - Interessado em técnicos
(21, 63, '2026-03-24 13:00:00'),
(21, 64, '2026-03-24 14:30:00'),
(21, 66, '2026-03-24 15:45:00'),

-- Cliente 25 - Interessado em biografias
(25, 50, '2026-03-23 10:00:00'),
(25, 52, '2026-03-23 11:30:00'),
(25, 53, '2026-03-23 12:45:00'),

-- Cliente 28 - Interessado em ficção científica
(28, 1, '2026-03-22 08:00:00'),
(28, 2, '2026-03-22 09:15:00'),
(28, 3, '2026-03-22 10:30:00'),
(28, 6, '2026-03-22 11:45:00');

-- ============================================================================
-- 8. INSERIR NOTIFICAÇÕES
-- ============================================================================
INSERT INTO notificacao (id_cliente, mensagem, tipo_notificacao, lida, data_criacao, id_livro) VALUES
-- Notificações de VENCIMENTO_PRÓXIMO
(1, 'O livro "Duna" deve ser devolvido em 2 dias.', 'VENCIMENTO_PROXIMO', FALSE, '2026-04-01 10:00:00', 1),
(2, 'O livro "O Senhor dos Anéis" deve ser devolvido amanhã.', 'VENCIMENTO_PROXIMO', FALSE, '2026-04-04 09:00:00', 7),
(3, 'O livro "Harry Potter e a Pedra Filosofal" deve ser devolvido em 3 dias.', 'VENCIMENTO_PROXIMO', FALSE, '2026-04-05 11:00:00', 8),
(4, 'O livro "A Culpa é das Estrelas" deve ser devolvido hoje!', 'VENCIMENTO_PROXIMO', TRUE, '2026-03-28 08:00:00', 31),

-- Notificações de LIVRO_DISPONIVEL
(6, 'O livro "Duna" que você estava interessado agora está disponível!', 'LIVRO_DISPONIVEL', FALSE, '2026-03-25 14:00:00', 1),
(10, 'O livro "Orgulho e Preconceito" que você estava interessado agora está disponível!', 'LIVRO_DISPONIVEL', TRUE, '2026-03-20 10:00:00', 26),
(14, 'O livro "Admirável Mundo Novo" que você estava interessado agora está disponível!', 'LIVRO_DISPONIVEL', FALSE, '2026-03-27 09:30:00', 5),

-- Notificações extras
(1, 'Você tem 2 empréstimos ativos. Lembre-se de devolver até a data prevista.', 'VENCIMENTO_PROXIMO', TRUE, '2026-03-27 12:00:00', NULL),
(2, 'Você renovou o empréstimo de "O Senhor dos Anéis" 1 vez. Máximo permitido: 2 renovações.', 'VENCIMENTO_PROXIMO', TRUE, '2026-03-27 15:00:00', 7),
(21, 'Novos livros técnicos foram adicionados ao acervo!', 'LIVRO_DISPONIVEL', FALSE, '2026-03-26 16:00:00', NULL);

-- ============================================================================
-- RELATÓRIO FINAL
-- ============================================================================
SELECT 'RESUMO DO MOCK BANCO DE DADOS' AS '';
SELECT '====================================' AS '';
SELECT
    'Funcionários' AS Tipo,
    COUNT(*) AS Total
FROM funcionario
UNION ALL
SELECT
    'Clientes' AS Tipo,
    COUNT(*) AS Total
FROM cliente
UNION ALL
SELECT
    'Livros' AS Tipo,
    COUNT(*) AS Total
FROM livro
UNION ALL
SELECT
    'Categorias' AS Tipo,
    COUNT(*) AS Total
FROM categoria
UNION ALL
SELECT
    'Emprestimos Ativos' AS Tipo,
    COUNT(*) AS Total
FROM emprestimo
WHERE status = 'ATIVO'
UNION ALL
SELECT
    'Emprestimos Finalizados' AS Tipo,
    COUNT(*) AS Total
FROM emprestimo
WHERE status = 'FINALIZADO'
UNION ALL
SELECT
    'Emprestimos Pendentes' AS Tipo,
    COUNT(*) AS Total
FROM emprestimo
WHERE status = 'PENDENTE'
UNION ALL
SELECT
    'Lista de Interesse' AS Tipo,
    COUNT(*) AS Total
FROM livro_interesse
UNION ALL
SELECT
    'Notificações' AS Tipo,
    COUNT(*) AS Total
FROM notificacao;

SELECT 'Mock de dados criado com sucesso!' AS '';
