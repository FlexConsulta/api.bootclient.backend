const moment = require('moment');
const { MotoristaGetAll, MotoristaSetData } = require('../../config/sql/motoristas.js');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { apiFlex } = require('../../API/api.js');
const { CNPJ, SQL_LIMIT } = process.env;

class Motoristas extends GerarArquivo {

      constructor(value, empresa) {
            super()

            this.pastaSync = process.env.FOLDER_SYNC_SUCCESS
            this.empresa = empresa;

            return new Promise(async resolve => {
                  await this.fnStart(value)
                  resolve(true)
            })
      }

      async fnStart(value) {

            const data = { data: value }
            data.query_sql = value ? MotoristaSetData(moment(value, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm")) : MotoristaGetAll()

            await this.sincronizar(data);
      }

      async sincronizar(data) {
            return new Promise(async (resolve) => {

                  const dados = this.empresa;

                  const dataConexao = {
                    nome_banco: dados.banco_server,
                    usuario_banco: dados.usuario_server,
                    senha_banco: dados.senha_server,
                    host_banco: dados.url_server,
                    dialect: dados.tipo_banco,
                    porta_banco: Number(dados.porta_server),
                  };

                  let arquivos = 0
                  let offset = 0;
                  while(true){

                        // setar a query
                        let query;
                        if(!data.data){
                          const replaceParameters = (string, offset) => {
                            const arr = string.split("{");
                            arr.splice(1, 1, `${SQL_LIMIT} OFFSET `);
                            arr.splice(2, 1, `${offset}`);
                            string = String(arr.join(""));
                            return string;
                          };
                          query = replaceParameters(data.query_sql, offset);
                        } else query = data.query_sql;

                        // faz a query
                        const resultadoSequelize = await new sequelizePostgres(dataConexao)
                        const arrayDados = await resultadoSequelize.obterDados(query);

                        // criar arquivo
                        if (arrayDados?.length > 0) {
                              const dataEncriptado = await encryptedData(arrayDados)
                              await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_MOTORISTAS', CNPJ , this.pastaSync)

                              const dadosLogs = {
                                    cnpj_cliente: CNPJ,
                                    error: false,
                                    nome_arquivo: `SYNCz_MOTORISTAS_${CNPJ}`,
                                    entidade: "motoristas",
                              };

                              // gera o log
                              await apiFlex.post(`/bootclient/log?cnpj=${CNPJ}`, dadosLogs)
                        }

                        console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0}`);
                        arquivos++;
                        if(arrayDados.length < SQL_LIMIT ) break 
                        offset += SQL_LIMIT;
                  }
                  console.log({arquivos})
                  resolve(true);

            })

      }

}

module.exports = Motoristas