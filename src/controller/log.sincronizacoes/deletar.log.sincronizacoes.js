const { deletarTodosLogSincronizacao } = require('../../models/log.sincronizacao');
const { deletarTodosLogEnvioArquivos } = require('../../models/log.envio.arquivos');

const deletarTodosRegistros = async (req, res) => {

      try {

            res.status(400)
            await deletarTodosLogSincronizacao({})
            await deletarTodosLogEnvioArquivos({})

            res.status(202)
            res.send()

      } catch (error) {
            res.send(error)
      }

}

module.exports = {
      deletarTodosRegistros: deletarTodosRegistros,
}