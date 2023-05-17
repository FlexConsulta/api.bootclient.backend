const { Company } = require('../../config/databases');
const jwt = require('../../utils/tratamento.dados');

module.exports = async (req, res) => {
      try {

            res.status(400)

            await Company.asyncLoadDatabase()
            let resultado = await Company.asyncFindOne({})

            if (resultado) {
                  resultado = await jwt.funcaoDeDecriptarSimples(resultado.d)
            }

            res.status(200)
            res.send(resultado || 'Nenhuma empresa cadastrada')

      } catch (error) {
            console.log({ error });
            res.send(error?.message || error)
      }
}