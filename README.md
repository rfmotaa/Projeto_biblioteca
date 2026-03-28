Este é um projeto pessoal, em que o objetivo principal foi desenvolver uma aplicação robusta que visa gerenciar um ambiente de biblioteca, sinta-se a vontade para sugerir alterações ou reportar bugs! 

<h1 align="center">📚 Bibliomanager</h1>

<div align="center">
  <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white">
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white">
</div>

## 📖 Summary

- [Objetivo principal](#-objetivo-principal)
- [Funcionalidades](#-funcionalidades)
- [Como rodar](#-como-rodar)
- [Dashboard de Analytics](#-dashboard-de-analytics)
- [Contato](#-contato)

## 🥅 Objetivo principal

O principal objetivo deste projeto é demonstrar minha capacidade de construir um sistema full stack, além de construir uma base sólida de conhecimento nas ferramentas utilizadas .

Sobre o sistema, o principal objetivo foi:
- Se mostre organizado visualmente.
- Tenha um sistema de perfil e admin integrado.
- Faça com que os usuários possam realizar o CRUD de suas reservas.
- Siga as regras de negócio estabelecidas.

## ✨ Funcionalidades

### Para Funcionários/Admin
- **Gerenciamento de Livros**: CRUD completo do acervo da biblioteca
- **Gerenciamento de Clientes**: CRUD completo de usuários
- **Gerenciamento de Empréstimos**:
  - Aprovar ou rejeitar solicitações de empréstimo
  - Criar empréstimos diretamente
  - Renovar empréstimos ativos
  - Finalizar empréstimos (registrar devolução)
- **Dashboard de Analytics**: Visualização de métricas e estatísticas da biblioteca

### Para Clientes
- **Solicitar Empréstimos**: Solicitar reservas de livros disponíveis
- **Dashboard Pessoal**: Visualizar empréstimos ativos e históricos
- **Catálogo de Livros**: Buscar e visualizar livros disponíveis

## 📊 Dashboard de Analytics

O dashboard de analytics fornece uma visão completa dos dados da biblioteca através de métricas e visualizações.

### Métricas Disponíveis

1. **Status dos Empréstimos**
   - Solicitados (PENDENTE)
   - Negados (REJEITADO)
   - Aprovados (APROVADO, ATIVO, FINALIZADO)

2. **Empréstimos por Semana**
   - Visualização das últimas 12 semanas (configurável)
   - Barras horizontais proporcionais
   - Agrupamento por semana e ano

3. **Top Livros Mais Emprestados**
   - Ranking dos 10 livros mais populares (configurável)
   - Badges especiais para top 3 (ouro, prata, bronze)
   - Informações: título, autor, ISBN e quantidade

4. **Percentual de Livros Disponíveis**
   - Barra de progresso animada
   - Cálculo automático: (livros disponíveis / total) × 100
   - Exibição do total do acervo

### APIs do Dashboard

#### Endpoints Backend

| Endpoint | Método | Descrição | Parâmetros |
|----------|--------|-----------|------------|
| `/api/dashboard/analytics` | GET | Dados consolidados | `ultimasSemanas?`, `topLivros?` |
| `/api/dashboard/emprestimos-por-semana` | GET | Empréstimos por semana | `ultimasSemanas?` |
| `/api/dashboard/emprestimos-status` | GET | Status dos empréstimos | - |
| `/api/dashboard/livros-mais-emprestados` | GET | Top livros | `top?` |
| `/api/dashboard/percentual-livros` | GET | Percentual disponível | - |

#### Frontend - Hooks Customizados

```typescript
import { useDashboardAnalytics } from './hooks';

// Hook principal com cache
const { data, isLoading, error, refetch } = useDashboardAnalytics({
  ultimasSemanas: 12,
  topLivros: 10,
  cacheTime: 5 * 60 * 1000, // 5 minutos
});

// Hooks individuais
import { useEmprestimosPorSemana, useEmprestimosStatus } from './hooks';
const { data: semanas } = useEmprestimosPorSemana(12);
const { data: status } = useEmprestimosStatus();
```

### Tecnologias Utilizadas no Dashboard

**Backend:**
- Spring Boot 3.5.6
- Spring Data JPA
- MySQL 8.0
- Queries nativas e JPQL
- DTOs para transferência de dados

**Frontend:**
- React 19 com TypeScript
- Hooks customizados com cache
- Componentes reutilizáveis
- Lucide React (ícones)
- TailwindCSS (estilização)
- Sonner (toasts/notificações)

### Acesso ao Dashboard

O dashboard está acessível em `/analytics` após login como funcionário:
1. Faça login como funcionário
2. Clique em "Analytics" no menu superior
3. Visualize as métricas em tempo real

## 💻 Como rodar

### 📜 0. Pré requisitos a serem instalados

- Ter o Maven instalado na máquina<br>
  (Binary zip archive) em [Maven Downloads](https://maven.apache.org/download.cgi)
- Ter o Java/JDK instalado na máquina
- Ter o MySQL instalado na máquina
- Ter o GIT instalado na máquina (Recomendado)
- Ter o Node.JS instalado na máquina

### 📥 1. Clone este repositório e navegue até a pasta do projeto
Abra o terminal e execute o comando abaixo para clonar o repositório:
```
git clone https://github.com/rfmotaa/Projeto_biblioteca.git
```

### 🗄️ 2. Configurar o Banco de Dados

#### 2.1. Criar o Banco de Dados

Abra o terminal do MySQL e crie o banco de dados:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE Biblioteca;
EXIT;
```

Ou em uma única linha:
```bash
mysql -u root -p -e "CREATE DATABASE Biblioteca;"
```

#### 2.2. Executar os Scripts SQL

O projeto possui 4 scripts SQL que devem ser executados em ordem:

**📁 Localização dos scripts:** `Backend/`

1. **ScriptSQL.sql** - Criação inicial das tabelas
2. **migration_livro_refactor.sql** - Adiciona campos ao livro e cria categorias
3. **migration_add_numero_renovacoes.sql** - Adiciona campo de renovações
4. **migration_notificacoes.sql** - Cria sistema de notificações e lista de interesse

**Opção A: Executar um por um (recomendado para ver detalhes)**

```bash
# Script 1: Estrutura base
mysql -u root -p Biblioteca < Backend/ScriptSQL.sql

# Script 2: Refatoração de livros e categorias
mysql -u root -p Biblioteca < Backend/migration_livro_refactor.sql

# Script 3: Sistema de renovações
mysql -u root -p Biblioteca < Backend/migration_add_numero_renovacoes.sql

# Script 4: Notificações e lista de interesse
mysql -u root -p Biblioteca < Backend/migration_notificacoes.sql
```

**Opção B: Executar todos de uma vez**

```bash
mysql -u root -p Biblioteca < Backend/ScriptSQL.sql && \
mysql -u root -p Biblioteca < Backend/migration_livro_refactor.sql && \
mysql -u root -p Biblioteca < Backend/migration_add_numero_renovacoes.sql && \
mysql -u root -p Biblioteca < Backend/migration_notificacoes.sql
```

> **⚠️ Importante:** Substitua `root` pelo seu usuário do MySQL, se necessário. O sistema pedirá a senha do MySQL.

#### 2.3. (Opcional) Carregar Mock de Dados para Testes

Se você deseja carregar dados de exemplo para testar o sistema imediatamente:

```bash
mysql -u root -p Biblioteca < Backend/mock_biblioteca_extenso.sql
```

Este script irá:
- ✅ Limpar todos os dados existentes
- ✅ Criar 10 funcionários administradores
- ✅ Criar 30 clientes (28 ativos + 2 bloqueados)
- ✅ Criar 45 livros de diversos gêneros
- ✅ Criar 16 categorias
- ✅ Criar empréstimos de exemplo
- ✅ Criar lista de interesses e notificações

> **Nota:** Use este script apenas para testes. Ele **APAGARÁ** todos os dados existentes.

### ⚙️ 3. Configurar o Backend

#### 3.1. Atualizar Credenciais do Banco

Edite o arquivo `Backend/src/main/resources/application.properties` e atualize as credenciais:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Biblioteca
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**Substitua `SUA_SENHA_AQUI` pela senha do seu MySQL.**

#### 3.2. Rodar o Backend

Abra um terminal e execute:

```bash
cd Backend
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

### 🎨 4. Rodar o Frontend

Abra um novo terminal e execute:

```bash
cd Frontend
npm install
npm run dev
```

Acesse a porta que foi exibida no terminal (geralmente `http://localhost:5173` ou similar)

---

## 🔄 Recomendar Banco do Zero

Se você já executou os scripts e deseja recomeçar do zero:

### Opção 1: Deletar e Recriar o Banco

```bash
# Conecte ao MySQL
mysql -u root -p

# Delete o banco existente
DROP DATABASE Biblioteca;

# Recrie o banco
CREATE DATABASE Biblioteca;

# Saia do MySQL
EXIT;

# Reexecute os scripts SQL (veja seção 2.2 acima)
```

### Opção 2: Usar o Script Completo

```bash
# Deleta e recria o banco automaticamente
mysql -u root -p -e "DROP DATABASE IF EXISTS Biblioteca; CREATE DATABASE Biblioteca;"

# Execute os scripts SQL em ordem (veja seção 2.2 acima)
# E opcionalmente carregue o mock de dados (veja seção 2.3 acima)
```

## Log-ins de teste

Após aplicar o mock de dados, você terá acesso às seguintes contas:

### 👨‍💼 Funcionários (Administradores)

| Login | Senha | Nome |
|-------|-------|------|
| `carlos.admin` | `admin123` | Carlos Eduardo Silva |
| `ana.admin` | `admin234` | Ana Paula Santos |
| `roberto.admin` | `admin345` | Roberto Ferreira |
| `mariana.admin` | `admin456` | Mariana Costa |
| `pedro.admin` | `admin567` | Pedro Henrique Lima |

### 👤 Clientes

**Clientes ATIVOS:**

| Email | Senha | Nome | Status |
|-------|-------|------|--------|
| `joao.martins@email.com` | `jm123` | João Victor Martins | Ativo |
| `maria.pereira@email.com` | `mp234` | Maria Luiza Pereira | Ativo |
| `pedro.almeida@email.com` | `pa345` | Pedro Almeida | Ativo |
| `ana.rodrigues@email.com` | `acr456` | Ana Clara Rodrigues | Ativo |
| `lucas.fernandes@email.com` | `lf567` | Lucas Fernandes | Ativo |
| `juliana.castro@email.com` | `jc678` | Juliana Castro | Ativo |

**Clientes BLOQUEADOS (para testes):**

| Email | Senha | Nome | Status |
|-------|-------|------|--------|
| `marcos.bloqueado@email.com` | `ma245` | Marcos Antonio | Bloqueado |
| `carla.bloqueado@email.com` | `cd356` | Carla Daniela | Bloqueado |

> **Nota:** Existem 30 clientes no total (28 ativos + 2 bloqueados), 10 funcionários e 45 livros no mock de dados.

## 📊 Mock de Dados

O arquivo `mock_biblioteca_extenso.sql` contém um conjunto completo de dados para testes:

### Quantidade de Dados

- **10 Funcionários** - Administradores do sistema
- **30 Clientes** - 28 ativos + 2 bloqueados
- **45 Livros** - Diversos gêneros e autores
- **16 Categorias** - De Ficção Científica a Arte
- **45 Relacionamentos Livro-Categoria** - Livros categorizados
- **8 Empréstimos** - Ativos, finalizados, pendentes e aprovados
- **7 Lista de Interesse** - Clientes aguardando livros
- **3 Notificações** - Alertas de vencimento e disponibilidade

### Como Aplicar o Mock

1. Certifique-se de que o banco de dados está criado
2. Execute o script no MySQL:
   ```bash
   mysql -u root -p Biblioteca < Backend/mock_biblioteca_extenso.sql
   ```
3. O script limpará todos os dados existentes e inserirá os novos dados de teste
4. Pronto! Use os logins acima para acessar o sistema

### Categorias Disponíveis

- Ficção Científica
- Romance
- Drama
- Fantasia
- Mistério
- Terror
- Aventura
- Biografia
- História
- Ciência
- Técnico
- Infantil
- Juvenil
- Poesia
- Arte
- Outros

### Livros em Destaque

Alguns livros populares incluídos no mock:
- **Duna** (Frank Herbert) - Ficção Científica
- **O Senhor dos Anéis** (J.R.R. Tolkien) - Fantasia
- **Harry Potter e a Pedra Filosofal** (J.K. Rowling) - Fantasia/Infantil
- **1984** (George Orwell) - Ficção Científica
- **Orgulho e Preconceito** (Jane Austen) - Romance
- **O Código Da Vinci** (Dan Brown) - Mistério
- **It: A Coisa** (Stephen King) - Terror
- **Clean Code** (Robert C. Martin) - Técnico

## 📫 Contato

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rfmotaa)

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rafaelssoni1000@gmail.com)

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rfmota/)

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/rf_motaa/)
