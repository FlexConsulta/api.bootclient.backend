const { criarLogEnvioArquivos } = require('../../models/log.envio.arquivos');
const fs = require('fs')

const tratamentoArquivos = async ({ values, destination }) => {

      const data = {
            arquivo: values.split('\\')[1],
            data: new Date()
      }

      await criarLogEnvioArquivos(data)
      await fs.unlink(destination, (err) => {
            if (err) throw err
      })

}

module.exports = tratamentoArquivos