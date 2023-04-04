const moment = require('moment');
const { Company } = require('../../config/databases');
const Validation = require('../../utils/validation');
const sequelizePostgres = require('../../services/sequelize.service');
const jwt = require('../../utils/tratamento.dados');
const sincronizacaoAutomatica = require('../../controller/sincronizacao.automatica');


module.exports = async (req, res) => {
      try {

            res.status(400)

            let {
                  cnpj, intervaloSincronizacao, datasincronizacao,
                  urlservidor, usuarioservidor, senhaservidor,
                  portaservidor, nomebancodados, emailDeNotificacao,
            } = req.body

            if (cnpj) Validation.cnpj(cnpj, 'O cnpj da empresa é inválido!')

            if (intervaloSincronizacao) {
                  Validation.number(intervaloSincronizacao, 'O formato do intervalo de sincronização está incorreto!')
            }

            if (portaservidor) Validation.number(portaservidor, 'O formato da porta de conexão com o banco está incorreto!')
            if (emailDeNotificacao) Validation.email(emailDeNotificacao, 'O Email de notificação é inválido!')

            if (datasincronizacao) {
                  if (!moment(datasincronizacao, ["MM/DD/YYYY HH:mm", "DD/MM/YYYY HH:mm"]).isValid()) throw new Error("O formato da data de sincronização está incorreta!")
            }

            const resultado = await Company.asyncFindOne({})
            if (!resultado) {
                  res.status(409)
                  throw new Error("Nenhuma empresa cadastrada!")
            }

            const dados = await jwt.funcaoDeDecriptarSimples(resultado.d)

            const data = {
                  nome_banco: nomebancodados || dados.nomebancodados,
                  usuario_banco: usuarioservidor || dados.usuarioservidor,
                  senha_banco: senhaservidor || dados.senhaservidor,
                  host_banco: urlservidor || dados.urlservidor,
                  dialect: "postgres",
                  porta_banco: portaservidor || dados.portaservidor
            }

            const resultadoSequelize = await new sequelizePostgres(data)
            const resultadoTeste = await resultadoSequelize.testarConexao()
            if (!resultadoTeste) throw new Error('Conexão inválida com o banco de dados!')

            let dataObject = { ...dados, ...req.body }
            dataObject = await jwt.funcaoDeEncriptarSimples(dataObject)

            await Company.asyncUpdate({}, { $set: { d: dataObject } }, {},)
            await Company.asyncLoadDatabase()

            if (intervaloSincronizacao) {
                  await new sincronizacaoAutomatica(new Date())
            }

            res.status(200)
            res.send("Empresa atualizada com sucesso")

      } catch (error) {
            res.send(error?.message || error)
      }
}