const log_sincronizacao = require('../../models/log.sincronizacao').pegarUltimoLogSincronizacao;
const { deletarTodosLogSincronizacao, criarLogSincronizacao } = require('../../models/log.sincronizacao');
const { deletarTodosLogEnvioArquivos } = require('../../models/log.envio.arquivos');

class LimpezaAutomaticaLogs {

      constructor(data) {



            const interval = 60 * 60 * 48000; // 48 hours in msec);
            setInterval(async () => {

                  const log_motorista = await log_sincronizacao({ tipo: "SYNCz_MOTORISTAS" })
                  const log_proprietario = await log_sincronizacao({ tipo: "SYNCz_PROPRIETARIOS" })
                  const log_veiculos = await log_sincronizacao({ tipo: "SYNCz_VEICULOS" })
                  const log_viagens = await log_sincronizacao({ tipo: "SYNCz_VIAGENS" })


                  const array = []
                  if (log_motorista) {
                        delete log_motorista._id
                        array.push(log_motorista)
                  }

                  if (log_proprietario) {
                        delete log_proprietario._id
                        array.push(log_proprietario)

                  }
                  if (log_veiculos) {
                        delete log_veiculos._id
                        array.push(log_veiculos)

                  }
                  if (log_viagens) {
                        delete log_viagens._id
                        array.push(log_viagens)
                  }

                  await deletarTodosLogEnvioArquivos()
                  await deletarTodosLogSincronizacao()

                  for (const iterator of array) {
                        await criarLogSincronizacao(iterator)
                  }


            }, interval);

      }

}

module.exports = LimpezaAutomaticaLogs