const { expect } = require('chai')
const {
    criarFuncionario,
    excluirFuncionariosPorCpf,
    funcionarioValido,
    realizarLogin
} = require('../../helpers/graphqlHelper')

describe('Mutation - Criar Funcionário', () => {
    let token

    const cpfsTeste = [
        '01127022013',
        '85870999064'
    ]

    async function excluirFuncionariosDeTeste() {
        await excluirFuncionariosPorCpf(cpfsTeste, token)
    }

    before(async () => {
        token = await realizarLogin()
        await excluirFuncionariosDeTeste()
    })

    after(async () => {
        await excluirFuncionariosDeTeste()
    })

    beforeEach(async () => {
        await excluirFuncionariosDeTeste()
    })

    it('deve criar funcionário com sucesso quando informados dados válidos', async () => {
        const resposta = await criarFuncionario(funcionarioValido(), token)

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

    it('não deve criar funcionário sem autenticação', async () => {
        const resposta = await criarFuncionario(funcionarioValido())

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Autenticação obrigatória.')
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'UNAUTHENTICATED')
    })

    it('não deve criar funcionário com salário base negativo', async () => {
        const resposta = await criarFuncionario(funcionarioValido({
            salario_base: -1
        }), token)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Salário base não pode ser negativo.')
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')
    })

    it('não deve criar funcionário com desligamento anterior à admissão', async () => {
        const resposta = await criarFuncionario(funcionarioValido({
            desligamento: '2020-01-09'
        }), token)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Desligamento não pode ser anterior à admissão.')
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')
    })

    it('não deve criar funcionário com CPF já cadastrado', async () => {
        await criarFuncionario(funcionarioValido({
            cpf: cpfsTeste[1]
        }), token)

        const resposta = await criarFuncionario(funcionarioValido({
            admissao: '2021-02-15',
            cpf: cpfsTeste[1],
            nome: 'maria',
            salario_base: 4500
        }), token)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Já existe funcionário com este CPF.')
        expect(resposta.body.errors[0].extensions).to.have.property('code', 'BAD_USER_INPUT')
    })
})
