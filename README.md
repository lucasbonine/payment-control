# API Payment Control: Controle de pagamentos simplificado.

API GraphQL em Node.js/Express para cadastro de usuários, funcionários e processamento de folha em memória.

Este projeto foi criado para praticar automação de testes de APIs, validando fluxos GraphQL como autenticação, criação de registros e respostas esperadas da aplicação.

## Tecnologias

- `Node.js`: ambiente de execução JavaScript usado para rodar a API e os testes.
- `Express`: framework HTTP usado como base do servidor da aplicação.
- `Apollo Server`: servidor GraphQL responsável por expor queries e mutations.
- `GraphQL`: linguagem de consulta usada para definir o contrato da API.
- `Supertest`: biblioteca usada nos testes para fazer requisições HTTP para a API.
- `Mocha`: framework de testes usado para organizar e executar os cenários automatizados.
- `Chai`: biblioteca de asserções usada para validar os retornos esperados.
- `start-server-and-test`: ferramenta usada para subir a API e executar os testes automaticamente.
- `JWT`: padrão usado para autenticação das operações protegidas via token.
- `bcryptjs`: biblioteca usada para comparar a senha informada com o hash salvo em memória.

## Execução

```bash
npm install
npm start
```

Acesse `http://localhost:4000/graphql`.

## Fluxo inicial

1. Faça `login` com `admin@admin.com` e senha `123456`, e copie o token retornado.
2. Envie `Authorization: Bearer <token>` para as operações protegidas.

O banco já é iniciado com o usuário `ADMIN` ativo.
```graphql
mutation {
  login(email: "admin@admin.com", senha: "123456") {
    token
    usuario { id nome }
  }
}
```


Os cadastros são armazenados em memória, nos arrays contidos no arquivo `src/database.js`.

## Testes

A suíte de testes cobre mutations GraphQL, incluindo:

- `login`: sucesso e cenários inválidos de credenciais/campos.
- `criarFuncionario`: criação de funcionário com sucesso usando autenticação via token.

Para rodar os testes subindo a API automaticamente:

```bash
npm test
```

Para rodar os testes sem subir a API, primeiro mantenha a API ativa em outro terminal:

```bash
npm start
```

Depois execute:

```bash
npm run test:mocha
```

Também é possível rodar apenas o teste de criação de funcionário com a API já ativa:

```bash
npx mocha test/specs/mutations/criarFuncionario.test.js
```
