const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { Login } = require('../../config/databases');
const Validation = require('../../utils/validation');
const { ENCODED, hash } = process.env


module.exports = async (req, res) => {

    try {

        res.status(400)
        const { senha } = req.body

        Validation.required(senha, 'A senha é obrigatória!')
        let resultado = await Login.asyncFindOne({})
        if (!resultado || !resultado.hash) resultado = { hash }

        const isMatch = await bcrypt.compareSync(senha, resultado.hash)

        if (!isMatch) throw new Error("Senha incorreta!")
        const now = Math.floor(Date.now() / 1000)

        const payload = { iat: now, exp: now + (60 * 60 * 24 * 2) }
        res.status(200).json({ ...payload, token: jwt.encode(payload, ENCODED) })

    } catch (error) {
        res.send(error?.message || error)
    }

}