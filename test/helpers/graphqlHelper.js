const request = require('supertest')
const {
    mutationCriarFuncionario,
    mutationExcluirFuncionario,
    mutationLogin,
    queryFuncionarios
} = require('./graphqlQueriesAndMutations')

const API_URL = 'http://localhost:4000'

function graphqlRequest({ query, variables, token }) {
    const requisicao = request(API_URL)
        .post('/graphql')

    if (token) {
        requisicao.set('Authorization', `Bearer ${token}`)
    }

    return requisicao.send({
        query,
        variables
    })
}

function funcionarioValido(overrides = {}) {
    return {
        admissao: '2020-01-10',
        cpf: '01127022013',
        nome: 'ana',
        salario_base: 5000,
        ...overrides
    }
}

async function realizarLogin() {
    const resposta = await graphqlRequest({
        query: mutationLogin,
        variables: {
            email: 'admin@admin.com',
            senha: '123456'
        }
    })

    return resposta.body.data.login.token
}

async function criarFuncionario(input, token) {
    return graphqlRequest({
        query: mutationCriarFuncionario,
        variables: {
            input
        },
        token
    })
}

async function listarFuncionarios(token) {
    return graphqlRequest({
        query: queryFuncionarios,
        token
    })
}

async function excluirFuncionario(id, token) {
    return graphqlRequest({
        query: mutationExcluirFuncionario,
        variables: {
            id
        },
        token
    })
}

async function excluirFuncionariosPorCpf(cpfs, token) {
    const resposta = await listarFuncionarios(token)
    const funcionarios = resposta.body.data.funcionarios.filter((item) => cpfs.includes(item.cpf))

    for (const funcionario of funcionarios) {
        await excluirFuncionario(funcionario.id, token)
    }
}

module.exports = {
    criarFuncionario,
    excluirFuncionariosPorCpf,
    funcionarioValido,
    realizarLogin
}
