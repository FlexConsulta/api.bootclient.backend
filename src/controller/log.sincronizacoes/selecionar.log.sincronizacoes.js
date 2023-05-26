const { pegarTodosLogSincronizacao } = require('../../models/log.sincronizacao');
const { pegarTodosLogEnvioArquivos } = require('../../models/log.envio.arquivos');
const moment = require('moment');

module.exports = async (req, res) => {

      try {

            res.status(400)
            const resultadoSincronizacoes = await pegarTodosLogSincronizacao({})
            const resultadoEnvioArquivos = await pegarTodosLogEnvioArquivos({})

            const fn_ordenar = (array, format) => array.sort(
                  (a, b) => format ? moment(b.data).valueOf() - moment(a.data).valueOf() :
                        moment(b.data).valueOf() - moment(a.data).valueOf()
            )

            const arrayFinalSincronizacoes = await fn_ordenar(resultadoSincronizacoes, true)
            const arrayFinalEnvioArquivos = await fn_ordenar(resultadoEnvioArquivos, false)

            res.status(200)
            res.send({
                  sinc: arrayFinalSincronizacoes,
                  envio: arrayFinalEnvioArquivos
            })

      } catch (error) {
            res.send(error)
      }

}