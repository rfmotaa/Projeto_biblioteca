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

### 🗄️ 2. Gerar o banco de dados na sua máquina

Rode o script `ScriptSQL.sql` na sua máquina para criar o banco de dados local.

### ⚙️ 3. Rodar o backend

Insira informações para conectar ao banco de dados presente na sua máquina em `Backend/resources/application.properties`

Em seguida, abra um terminal e rode o backend com o comando
```bash
cd Backend
mvn spring-boot:run
```

### 🎨 4. Acessar o frontend

Abra um novo terminal e execute os comandos
```bash
cd Frontend
npm install
npm run dev
```
Acesse a porta que foi dada no temrinal

## Log-ins de teste

*Funcionario*

> login: admin | senha: admin123 

*Cliente*

>

Ambos já foram criado ao rodar o `ScriptSQL.sql`.

## 📫 Contato

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rfmotaa)

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rafaelssoni1000@gmail.com)

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rfmota/)

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/rf_motaa/)
