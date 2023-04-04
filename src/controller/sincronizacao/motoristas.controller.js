const moment = require('moment');
const { MotoristaGetAll, MotoristaSetData } = require('../../config/sql/motoristas.js');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { apiFlex } = require('../../API/api.js');
const { CNPJ } = process.env;

class Motoristas extends GerarArquivo {

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
            data.query_sql = value ? MotoristaSetData(moment(value, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm")) : MotoristaGetAll()
            await this.sincronizar(data)
      }

      async sincronizar(data) {
            return new Promise(async (resolve) => {

                  const dataConexao = {
                    nome_banco: data.data.banco_server,
                    usuario_banco: data.data.usuario_server,
                    senha_banco: data.data.senha_server,
                    host_banco: data.data.url_server,
                    dialect: data.data.tipo_banco,
                    porta_banco: Number(data.data.porta_server),
                  };

                  const resultadoSequelize = await new sequelizePostgres(dataConexao)
                  const arrayDados = await resultadoSequelize.obterDados(MotoristaGetAll(0))

                  if (arrayDados?.length > 0) {
                        const dataEncriptado = await encryptedData(arrayDados)
                        await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_MOTORISTAS', this.pastaSync)

                        const dadosLogs = {
                          idcliente: data.data.idcliente,
                          cnpj_cliente: data.data.cnpj_empresa,
                          entidade: "MOTORISTAS",
                          error: false,
                          nome_arquivo: "SYNCz_MOTORISTAS",
                          data: moment().format("YYYY/MM/DD HH:mm:ss").valueOf(),
                          id: data.data.id,
                        };

                        await apiFlex.post(`/bootclient/log/?cnpj=${CNPJ}`, dadosLogs)
                              .then((response) => {
                                    console.log({ Log: response.data, msg: "Log Criado" });  
                              })
                              .catch((error) => {
                                    console.log({ error, Where: "Sync Mot post Log" });  
                              });
                  }

                  console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0}`);
                  resolve(true)
            })

      }

}

module.exports = Motoristas