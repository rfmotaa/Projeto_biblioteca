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
- [Desenvolvimento e tecnologias utilizadas](#-desenvolvimento-e-tecnologias-utilizadas)
- [Como rodar](#-como-rodar)
- [Contato](#-contato)

## 🥅 Objetivo principal

O principal objetivo deste projeto é demonstrar minha capacidade de construir um site com diversas funções integradas, o uso de Javascript puro foi escolhido propositalmente para aprimorar os fundamentos da linguagem, 
sendo uma ótima prática antes de iniciar o aprendizado com bibliotecas e frameworks mais avançados de front-end.

Sobre o site, temos em vista criar um local de reviews de jogos intuitivo que:
- Forneça informações sobre os jogos.
- Tenha um sistema de perfil integrado.
- Faça com que os usuários possam criar novas reviews, ve-lás, editar e excluir (CRUD).
- Permita ver reviews já publicadas previamente e o rating de determinado jogo.

Este projeto foi desenvolvido inteiramente com FIGMA, HTML/CSS e Javascript

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

## 📫 Contato

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rfmotaa)

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rafaelssoni1000@gmail.com)

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rfmota/)

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/rf_motaa/)
