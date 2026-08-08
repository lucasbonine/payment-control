const request = require('supertest')
const { expect } = require('chai')

describe('Mutation - Login', () => {

    it('deve realizar login com sucesso quando informadas credenciais válidas', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": "123456"
                }
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.data.login).to.have.property('token')
            expect(resposta.body.data.login.token).to.not.be.empty
            expect(resposta.body.data.login.token).to.not.be.a.string
            expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')

    })

    it('não deve realizar login com sucesso quando informadas credenciais inválidas', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": "1234567"
                }
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')

    })

    it('não deve realizar login quando o email não for informado', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "senha": "123456"
                }
            })

            expect(resposta.status).to.equal(400)
            expect(resposta.body.errors[0]).to.have.property('message', 'Variable "$email" of required type "String!" was not provided.')
            expect(resposta.body.errors[0].locations[0]).to.deep.equal({
                line: 1,
                column: 16
            })

    })

    it('não deve realizar login quando a senha não for informada', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin@admin.com"
                }
            })

            expect(resposta.status).to.equal(400)
            expect(resposta.body.errors[0]).to.have.property('message', 'Variable "$senha" of required type "String!" was not provided.')

    })

    it('não deve realizar login quando o email for numérico', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": 22,
                    "senha": "123456"
                }
            })

            expect(resposta.status).to.equal(400)
            expect(resposta.body.errors[0]).to.have.property('message', 'Variable "$email" got invalid value 22; String cannot represent a non string value: 22')
            expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')

    })

})
