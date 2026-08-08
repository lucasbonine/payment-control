# API Payment Control: Controle de pagamentos simplificado.

API GraphQL em Node.js/Express para cadastro de usuários, funcionários e processamento de folha em memória.

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
