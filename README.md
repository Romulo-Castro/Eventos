# Paloma Eventos

Paloma Eventos é uma aplicação web desenvolvida para a gestão de eventos, organizadores, participantes e muito mais. O principal objetivo da aplicação é facilitar a administração e visualização dos eventos em andamento, permitindo uma gestão eficiente e simplificada tanto para organizadores quanto para participantes.

## Objetivo

O objetivo do Paloma Eventos é fornecer uma plataforma prática e intuitiva para a administração de eventos, oferecendo um painel interativo que permite visualizar, organizar e gerenciar todas as informações relacionadas aos eventos.

A aplicação é focada em:

- **Organizadores**: Possibilidade de adicionar e editar organizadores de eventos.
- **Eventos**: Cadastro, edição e visualização de eventos.
- **Participantes**: Gerenciamento e listagem de participantes de eventos.
- **Autenticação**: Sistema de login simples para garantir acesso seguro e customizado.

## Funcionalidades

- **Dashboard**: Painel de controle para visualização de informações de forma centralizada.
- **Organização de Eventos**: Cadastro e edição de eventos, com informações detalhadas.
- **Gerenciamento de Participantes**: Listagem e controle de todos os participantes dos eventos.
- **Responsividade**: A aplicação é responsiva e pode ser utilizada em diferentes tamanhos de tela.
- **Design Moderno**: Interface com cores modernas, navegação intuitiva e elementos dinâmicos.

## Tecnologias Utilizadas

A aplicação Paloma Eventos foi construída utilizando as seguintes tecnologias:

- **Frontend**:
  - [React](https://reactjs.org/): Biblioteca JavaScript para construção de interfaces de usuário.
  - [React Router](https://reactrouter.com/): Para navegação entre páginas.
  - [React Bootstrap](https://react-bootstrap.github.io/): Framework CSS para estilização de componentes e layout.
  
- **Backend**:
  - Simulado ou em implementação futura.

- **Gerenciamento de Estado**:
  - **Hooks do React** para controle de estado global e local dentro dos componentes.

- **Outras Tecnologias**:
  - [Babel](https://babeljs.io/): Transpilador JavaScript.
  - [Webpack](https://webpack.js.org/): Empacotador de módulos.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

/src
  /components
    LoginForm.js
    EventForm.js
    ParticipantForm.js
    OrganizerForm.js
    Dashboard.js
    Navbar.js
  /pages
    LoginPage.js
    EventsPage.js
    ParticipantsPage.js
    OrganizersPage.js
  /styles
    App.css
    Login.css
    Forms.css
  App.js
  index.js

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- **Node.js** (v14+)
- **npm** (v6+)

## Instalação

Siga os passos abaixo para rodar o projeto localmente:

1. Clone o repositório:
   ```bash
   git clone https://github.com/Romulo-Castro/paloma-eventos.git

2. Acesse o diretório do projeto:
    ```bash
    cd paloma-eventos
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Rode o projeto:
    ```bash
    npm start
    ```

5. Abra seu navegador e acesse:
    ```
    http://localhost:3000
    ```

## Como Usar

1. **Tela de Login**: Insira suas credenciais para acessar o dashboard.
2. **Dashboard**: Após o login, você será redirecionado para o dashboard, onde poderá navegar pelas outras funcionalidades, como organizadores, eventos e participantes.
3. **Navegação**: Use o menu de navegação para acessar diferentes seções da aplicação.
4. **Footer**: Informações sobre direitos autorais e links adicionais estarão sempre no rodapé, com visual consistente.

## Contribuições

Contribuições são bem-vindas! Se você tem alguma sugestão de melhoria ou gostaria de reportar algum problema, sinta-se à vontade para abrir uma issue ou enviar um pull request.

---

Desenvolvido por Rômulo Narcizo, Davi Ribeiro e Wesley Leonardo.
