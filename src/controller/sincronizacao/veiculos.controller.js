const moment = require('moment');
const { VeiculosGetAll, VeiculosSetData } = require('../../config/sql/veiculos');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { pegarUmaEmpresa } = require('../../models/empresa');
const { criarLogSincronizacao } = require('../../models/log.sincronizacao');
const { encryptedData } = require('../../utils/encriptacao')

class Veiculos extends GerarArquivo {

      constructor(value) {
            super()

            this.pastaSync = process.env.FOLDER_SYNC_SUCCESS
            this.empresa = null
            return new Promise(async resolve => {
                  await this.fnStart(value)
                  resolve(true)
            })

      }

      async fnStart(value) {

            const data = { data: value }
            data.query_sql = value ? VeiculosSetData(moment(value, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm")) : VeiculosGetAll()
            this.empresa = await pegarUmaEmpresa()

            await this.sincronizar(data)

      }

      async sincronizar(data) {
            return new Promise(async (resolve) => {
                  if (!this.empresa) return false;

                  const dados = this.empresa

                  const dataConexao = {
                        nome_banco: dados.nomebancodados,
                        usuario_banco: dados.usuarioservidor,
                        senha_banco: dados.senhaservidor,
                        host_banco: dados.urlservidor,
                        dialect: "postgres",
                        porta_banco: dados.portaservidor
                  }

                  const resultadoSequelize = await new sequelizePostgres(dataConexao)
                  const arrayDados = await resultadoSequelize.obterDados(data.query_sql)

                  let dadosLogs = null;
                  if (arrayDados?.length > 0) {
                        const dataEncriptado = await encryptedData(arrayDados)
                        await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_VEICULOS', this.pastaSync)

                        dadosLogs = {
                              data: moment().format("YYYY/MM/DD HH:mm:ss"),
                              qtd: arrayDados?.length || 0,
                              tipo: 'SYNCz_VEICULOS',
                              count: moment().format("YYYY/MM/DD HH:mm:ss").valueOf()
                        }

                        await criarLogSincronizacao(dadosLogs)
                  }

                  console.log(`[VEICULOS X] || ${dadosLogs?.qtd || 0}`);
                  resolve(true)

            })

      }

}

module.exports = Veiculos