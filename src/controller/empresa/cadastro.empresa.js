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
                  nome, cnpj, token, intervaloSincronizacao,
                  urlservidor, usuarioservidor, senhaservidor,
                  portaservidor, nomebancodados, emailDeNotificacao,
                  hostftp, portaftp, usuarioftp, senhaftp, segurancaftp, datasincronizacao
            } = req.body

            Validation.required(nome, 'O nome da empresa é obrigatória!')
            Validation.required(cnpj, 'O cnpj da empresa é obrigatório!')
            Validation.cnpj(cnpj, 'O cnpj da empresa é inválido!')

            Validation.required(token, 'O token de sincronização é obrigatório!')
            Validation.required(intervaloSincronizacao, 'O intervalo de  sincronização é obrigatório!')
            Validation.number(intervaloSincronizacao, 'O formato do intervalo de sincronização está incorreto!')

            Validation.required(urlservidor, 'O Host de conexão com o banco é obrigatório!')
            Validation.required(usuarioservidor, 'O usuário de conexão com o banco é obrigatório!')
            Validation.required(senhaservidor, 'A senha de conexão com o banco é obrigatório!')
            Validation.required(portaservidor, 'A porta de conexão com o banco é obrigatória!')
            Validation.number(portaservidor, 'O formato da porta de conexão com o banco está incorreto!')
            Validation.required(nomebancodados, 'O nome do banco de dados é obrigatório!')

            Validation.required(hostftp, 'O url do FTP é obrigatório!')
            Validation.required(portaftp, 'A porta do FTP é obrigatório!')
            Validation.number(portaftp, 'O formato da porta do FTP está incorreto!')

            Validation.required(usuarioftp, 'O usuário FTP é obrigatório!')
            Validation.required(senhaftp, 'A senha FTP é obrigatória!')
            Validation.required(segurancaftp, 'A especificidade da segurança é obrigatória!')
            segurancaftp = String(segurancaftp)
            if (segurancaftp !== 'false' && segurancaftp !== 'true') throw new Error('O formato da especificidade da segurança está incorreta!')

            if (datasincronizacao) {
                  if (!moment(datasincronizacao, ["MM/DD/YYYY HH:mm", "DD/MM/YYYY HH:mm"]).tz('America/Sao_Paulo').isValid()) throw new Error("O formato da data de sincronização está incorreta!")
            }

            datasincronizacao = moment(datasincronizacao, ["MM/DD/YYYY HH:mm", "DD/MM/YYYY HH:mm"]).tz('America/Sao_Paulo').format("YYYY/MM/DD HH:mm")

            if (emailDeNotificacao) Validation.email(emailDeNotificacao, 'O Email de notificação é inválido!')


            const resultado = await Company.asyncFindOne({})
            if (resultado) {
                  res.status(409)
                  throw new Error("Já existe uma empresa cadastrada!")
            }

            const data = {
                  nome_banco: nomebancodados,
                  usuario_banco: usuarioservidor,
                  senha_banco: senhaservidor,
                  host_banco: urlservidor,
                  dialect: "postgres",
                  porta_banco: portaservidor
            }

            const resultadoSequelize = await new sequelizePostgres(data)

            const resultadoTeste = await resultadoSequelize.testarConexao()
            if (!resultadoTeste) throw new Error('Conexão inválida com o banco de dados!')

            const dados = await jwt.funcaoDeEncriptarSimples(req.body)

            await Company.asyncInsert({ d: dados })
            await Company.asyncLoadDatabase()

            new sincronizacaoAutomatica(new Date())

            res.status(200)
            res.send("Empresa cadastrada com sucesso")

      } catch (error) {
            res.send(error?.message || error)
      }
}


