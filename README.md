# Gerenciador de biblioteca

**Estrutura de pastas**
```
Projeto_Biblioteca/
├── backend/                # Código do backend Java/Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/projeto/biblioteca/
│   │   │   │       ├── controller/      # APIs REST
│   │   │   │       ├── service/         # Lógica de negócio
│   │   │   │       ├── repository/      # Interfaces JPA/Hibernate
│   │   │   │       ├── model/           # Entidades JPA/Hibernate
│   │   │   │       └── config/          # Configurações do Spring Boot
│   │   │   └── resources/
│   │           └── application.properties  # Configuração do Spring Boot
│   ├── pom.xml                               # Dependências Maven
│   └── .gitignore
│
├── frontend/               # Código do frontend React
│   ├── public/             # Arquivos públicos (index.html, favicon, etc.)
│   ├── src/
│   │   ├── components/     # Componentes React reutilizáveis
│   │   ├── pages/          # Páginas ou telas principais
│   │   ├── services/       # Comunicação com backend (API calls)
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # CSS / SASS / Styled Components
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── database/               # Scripts SQL e documentação do banco
│   ├── schema.sql          # Estrutura inicial do banco
│   ├── seed.sql            # Dados de exemplo (opcional)
│   └── README.md           # Documentação do banco
│
├── docs/                   # Documentação do projeto
│   ├── diagramas/          # Diagramas UML, ER, etc.
│   ├── casos-de-uso/       # Casos de uso
│   └── README.md
│
├── .gitignore              # Ignorar arquivos gerais
└── README.md               # Descrição geral do projeto
```

Como rodar o backend

```
cd Backend
mvn spring-boot:run
```

Como rodar o frontend

```

```