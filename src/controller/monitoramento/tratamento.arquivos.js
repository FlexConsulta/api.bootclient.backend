const { criarLogEnvioArquivos } = require('../../models/log.envio.arquivos');
const fs = require('fs')
const util = require('util');

const unlinkPromise = util.promisify(fs.unlink);

const tratamentoArquivos = async ({ values, destination }) => {
      try {

            const data = {
                  arquivo: values.split('\\')[1],
                  data: new Date()
            }

            await criarLogEnvioArquivos(data)
            console.log('O arquivo foi excluído com sucesso.');
            return await unlinkPromise(destination);

      } catch (error) {
            console.log(error?.message);
            return
      }

}

module.exports = tratamentoArquivos