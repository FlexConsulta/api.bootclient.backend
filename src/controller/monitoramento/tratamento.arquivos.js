<<<<<<< HEAD
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

=======
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
            if (!fs.existsSync(destination)) await unlinkPromise(destination);
      } catch (error) {
            console.log(error?.message);
            return
      }

}

>>>>>>> joey.flex
module.exports = tratamentoArquivos