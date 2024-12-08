# Paloma Eventos

Paloma Eventos é uma aplicação web desenvolvida para a gestão de eventos, organizadores, participantes e muito mais. O principal objetivo da aplicação é facilitar a administração e visualização dos eventos em andamento, permitindo uma gestão eficiente e simplificada tanto para organizadores quanto para participantes.

## Objetivo

O objetivo do Paloma Eventos é fornecer uma plataforma prática e intuitiva para a administração de eventos, oferecendo um painel interativo que permite visualizar, organizar e gerenciar todas as informações relacionadas aos eventos.

A aplicação é focada em:

- **Organizadores**: Possibilidade de adicionar, editar e excluir organizadores de eventos.
- **Eventos**: Cadastro, edição, visualização e exclusão de eventos.
- **Participantes**: Gerenciamento, listagem e exclusão de participantes de eventos.
- **Autenticação**: Sistema seguro de login com controle de acesso baseado em roles (`ADMIN`, `ORGANIZER`, `PARTICIPANT`).

## Funcionalidades

### Dashboard Interativo:
- Exibe gráficos detalhados de eventos, participantes e organizadores.
- Relatórios mensais para análise de desempenho.

### Gestão de Organizadores:
- Cadastro de novos organizadores.
- Atualização de dados.
- Exclusão de registros.

### Gestão de Eventos:
- Informações completas sobre cada evento.
- Vinculação de eventos a organizadores.
- Pesquisa dinâmica por nome ou local.

### Gestão de Participantes:
- Listagem com filtros por nome, email ou evento.
- Inclusão e remoção de participantes de eventos.

### Sistema de Login Seguro:
- Suporte a diferentes roles (`ADMIN`, `ORGANIZER` e `PARTICIPANT`).
- Controle de acesso em tempo real.
- Mensagens de erro detalhadas em caso de autenticação incorreta.

## Tecnologias Utilizadas

### Frontend:
- **React**: Biblioteca JavaScript para construção de interfaces.
- **React Router**: Gerenciamento de rotas para navegação.
- **React Bootstrap**: Estilização e layout responsivo.
- **Recharts**: Gráficos dinâmicos e interativos.

### Backend:
- **Spring Boot**: Framework Java para criação de APIs RESTful.
- **JWT (JSON Web Tokens)**: Para autenticação e controle de acesso.
- **Hibernate**: ORM para gerenciamento de banco de dados.
- **Banco de Dados**: MySQL.

## Instalação

### Pré-requisitos
Antes de começar, certifique-se de ter o seguinte instalado:

- **Node.js** (v14+)
- **npm** (v6+)
- **MySQL** (para o banco de dados)

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Romulo-Castro/paloma-eventos.git
2. Acesse o diretório do projeto:
   ```bash
   cd paloma-eventos
4. Instale as dependências:
   ```bash
   npm install
5. Configure o banco de dados no backend:
  - Atualize as credenciais do banco no arquivo application.properties do backend.
6. Rode o backend: ./mvnw spring-boot:run
7. Rode o frontend: npm start
8. Acesse o projeto no navegador: http://localhost:3000

## Como Usar

### Login
1. Insira suas credenciais de usuário (email).
2. Usuários com roles diferentes terão acesso restrito:
  - ADMIN: Acesso completo ao sistema.
  - ORGANIZER: Gerenciamento de eventos e organizadores.
  - PARTICIPANT: Visualização de eventos e participação.

### Navegação
Use o menu lateral para acessar:
- Dashboard
- Gestão de Organizadores
- Gestão de Eventos
- Gestão de Participantes

### Dashboard
- Gráficos para análise de métricas.
- Atualização de dados em tempo real.

## Contribuições
Contribuições são bem-vindas! Caso tenha ideias ou encontre problemas, envie um pull request ou crie uma issue no repositório.

## Autores
### Desenvolvido por:
- Rômulo Narcizo
- Davi Ribeiro
- Wesley Leonardo