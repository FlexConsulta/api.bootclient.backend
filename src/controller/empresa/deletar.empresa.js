const { Company } = require('../../config/databases');

module.exports = async (req, res) => {
      try {

            res.status(400)

            await Company.asyncRemove({})
            await Company.asyncLoadDatabase()

            res.status(200)
            res.send('Empresa removida com sucesso!')

      } catch (error) {
            res.send(error?.message || error)
      }
}