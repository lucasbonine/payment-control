const mutationLogin = `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`

const mutationCriarFuncionario = `mutation Mutation($input: CriarFuncionarioInput!) {
                                    criarFuncionario(input: $input) {
                                        admissao
                                        id
                                        cpf
                                        nome
                                        salario_base
                                        desligamento
                                    }
                                }`

const queryFuncionarios = `query Funcionarios {
                            funcionarios {
                                id
                                cpf
                            }
                        }`

const mutationExcluirFuncionario = `mutation ExcluirFuncionario($id: ID!) {
                                        excluirFuncionario(id: $id)
                                    }`

module.exports = {
    mutationCriarFuncionario,
    mutationExcluirFuncionario,
    mutationLogin,
    queryFuncionarios
}
