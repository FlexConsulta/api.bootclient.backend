// DEPENDÊNCIAS
const bcrypt = require('bcryptjs');

const { Login } = require('../../config/databases');
const Validation = require('../../utils/validation');
const { hash } = process.env

module.exports = async (req, res) => {

    try {

        res.status(400)

        // Corpo da Requisição
        const { senhaatual, senhanova, senharepetida } = req.body


        // Validação dos campos
        Validation.required(senhaatual, 'A senha atual é obrigatória!')
        Validation.required(senhanova, 'A nova senha é obrigatória!')
        Validation.required(senharepetida, 'A senha repetida é obrigatória!')

        Validation.isMatch(senhanova, senharepetida, 'A nova senha não corresponde à senha repetida!')

        let resultado = await Login.asyncFindOne({})
        const pass = resultado ? resultado?.hash || hash : hash

        const isMatch = await bcrypt.compareSync(senhaatual, pass)
        if (!isMatch) throw new Error("Senha antiga incorreta!")

        const novoHash = await encryptPassword(senhanova)

        await Login.asyncRemove({}, { multi: true })
        await Login.asyncInsert({ hash: novoHash })
        await Login.asyncLoadDatabase()


        res.status(200)
        res.send('Senha trocada com sucesso')

    } catch (error) {
        res.send(error.message || error)
    }

}



// Função de encriptação da senha do Usuário
function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}