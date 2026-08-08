const request = require('supertest')
const { expect } = require('chai')

describe('Mutation - Criar Funcionário', () => {
    let token
    const cpf = '01127022013'

    async function realizarLogin() {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    email: 'admin@admin.com',
                    senha: '123456'
                }
            })

        return resposta.body.data.login.token
    }

    async function excluirFuncionarioPorCpf() {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `query Funcionarios {
                            funcionarios {
                                id
                                cpf
                            }
                        }`
            })

        const funcionario = resposta.body.data.funcionarios.find((item) => item.cpf === cpf)

        if (funcionario) {
            await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `mutation ExcluirFuncionario($id: ID!) {
                                excluirFuncionario(id: $id)
                            }`,
                    variables: {
                        id: funcionario.id
                    }
                })
        }
    }

    before(async () => {
        token = await realizarLogin()
        await excluirFuncionarioPorCpf()
    })

    after(async () => {
        await excluirFuncionarioPorCpf()
    })

    it('deve criar funcionário com sucesso quando informados dados válidos', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($input: CriarFuncionarioInput!) {
                            criarFuncionario(input: $input) {
                                admissao
                                id
                                cpf
                                nome
                                salario_base
                            }
                        }`,
                variables: {
                    input: {
                        admissao: '2020-01-10',
                        cpf,
                        nome: 'ana',
                        salario_base: 5000
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.include({
            admissao: '2020-01-10',
            cpf: '01127022013',
            nome: 'ana',
            salario_base: 5000
        })
        expect(resposta.body.data.criarFuncionario.id).to.be.a('string')
        expect(resposta.body.data.criarFuncionario.id).to.not.be.empty
    })
})
