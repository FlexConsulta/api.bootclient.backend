<<<<<<< HEAD
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment");
const { formatarData } = require('../../utils/tratamento.dados.js');
const filePrefix = process.env.FILE_VERSION
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS, DATAINICIAL } = process.env;

class Motoristas extends GerarArquivo {
      constructor({
            dbObjectConnection,
            cnpj_empresa,
            dbSQL,
            lastSyncDate
      }) {

            super();
            this.dbObjectConnection = dbObjectConnection
            this.cnpj_empresa = cnpj_empresa
            this.dbSQL = JSON.parse(dbSQL)
            this.lastSyncDate = lastSyncDate

            return new Promise(async (resolve) => {
                  await this.sincronizar();
                  resolve(true);
            });
      }

      async sincronizar() {
            return new Promise(async (resolve) => {
              try {
                // throw new Error("Error manual");

                let SQL;
                if (this.lastSyncDate) {
                  SQL = this.dbSQL.daily_sync;
                  const lastDateLog = moment(this.lastSyncDate).tz('America/Sao_Paulo').format("YYYY/MM/DD HH:mm");
                  const data_query = moment(lastDateLog, ["DD/MM/YYY HH:mm","YYYY/MM/DD HH:mm"]).tz('America/Sao_Paulo').subtract(4, 'hours').format("YYYY/MM/DD HH:mm");
                  SQL = SQL.replace("[$]", data_query);
                } else SQL = this.dbSQL.initial_sync;

                let offset = 0;

                for (let i = 0; ; i++) {
                  
                if (SQL.includes(":")) {
                  SQL = SQL.replace(";", " ");
                }
                
                  const _sql = `${SQL} LIMIT ${SQL_LIMIT || 500} OFFSET ${offset};`;

                  const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
                  const arrayDados = await resultadoSequelize.obterDados(_sql);

                  const dataEncriptado = await encryptedData(arrayDados);

                  const convertedCNPJ = String(this.cnpj_empresa).replaceAll(/\D/g, '');
                  const fileName = `${filePrefix}_MOTORISTAS_${convertedCNPJ}_${moment().tz('America/Sao_Paulo').valueOf()}`;
                  if (arrayDados?.length > 0) {
                    await this.fnGeradorArquivo(
                      FOLDER_SYNC_SUCCESS,fileName,dataEncriptado
                      );
                  }

                  const rsltLogsRegister = await fnGerarLogs({
                    cnpj_cliente: this.cnpj_empresa,
                    nome_arquivo: fileName,
                    error: false,
                    entidade: "motoristas",
                    quantidade: String(arrayDados.length),
                    categoria: "SINCRONIZACAO_DADOS",
                    data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                    mensagem: "Sincronização dos dados do motorista concluídos com sucesso!",
                  });

                  console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0} ${arrayDados?.length > 0 ? '|| ' + fileName : ''}`);
                  if (arrayDados.length < SQL_LIMIT || 500) break;
                  offset += SQL_LIMIT || 500;
                }

                resolve(true);
              } catch (error) {
                const rsltLogsRegister = await fnGerarLogs({
                  cnpj_cliente: this.cnpj_empresa,
                  nome_arquivo: null,
                  error: true,
                  entidade: "motoristas",
                  quantidade: null,
                  categoria: "SINCRONIZACAO_DADOS_MOTORISTAS_ERRO",
                  data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                  mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
                });
                console.log({ rsltLogsRegister });
                resolve({ error: true, message: error.message });
              }
            });
      }
}

=======
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment");
const filePrefix = process.env.FILE_VERSION
let { SQL_LIMIT, FOLDER_SYNC_SUCCESS } = process.env;

class Motoristas extends GerarArquivo {
    constructor({
        dbObjectConnection,
        cnpj_empresa,
        dbSQL,
        lastSyncDate
    }) {

        super();
        this.dbObjectConnection = dbObjectConnection
        this.cnpj_empresa = cnpj_empresa
        this.dbSQL = JSON.parse(dbSQL)
        this.lastSyncDate = lastSyncDate

        return new Promise(async (resolve) => {
            await this.sincronizar();
            resolve(true);
        });
    }

    async sincronizar() {
        return new Promise(async (resolve) => {
            try {

                let SQL;
                if (this.lastSyncDate) {
                    SQL = this.dbSQL.daily_sync;
                    const lastDateLog = moment(this.lastSyncDate).tz('America/Sao_Paulo').format("YYYY/MM/DD HH:mm");
                    const data_query = moment(lastDateLog, ["DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm"]).tz('America/Sao_Paulo').subtract(4, 'hours').format("YYYY/MM/DD HH:mm");
                    SQL = SQL.replace("[$]", data_query);
                } else SQL = this.dbSQL.initial_sync;


                let offset = 0;
                if (!SQL_LIMIT || SQL_LIMIT == 0) SQL_LIMIT = 500

                for (let i = 0; ; i++) {

                    if (SQL.includes(";")) {
                        SQL = SQL.replace(";", " ");
                    }

                    SQL_LIMIT = +SQL_LIMIT
                    const _sql = `${SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset};`;

                    const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
                    const arrayDados = await resultadoSequelize.obterDados(_sql);

                    const dataEncriptado = await encryptedData(arrayDados);

                    const convertedCNPJ = String(this.cnpj_empresa).replaceAll(/\D/g, '');
                    const fileName = `${filePrefix}_MOTORISTAS_${convertedCNPJ}_${moment().tz('America/Sao_Paulo').valueOf()}`;
                    if (arrayDados?.length > 0) {
                        await this.fnGeradorArquivo(
                            FOLDER_SYNC_SUCCESS, fileName, dataEncriptado
                        );
                    }

                    const rsltLogsRegister = await fnGerarLogs({
                        cnpj_cliente: this.cnpj_empresa,
                        nome_arquivo: fileName,
                        error: false,
                        entidade: "motoristas",
                        quantidade: String(arrayDados.length),
                        categoria: "SINCRONIZACAO_DADOS",
                        data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                        mensagem: "Sincronização dos dados do motorista concluídos com sucesso!",
                    });

                    console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0} ${arrayDados?.length > 0 ? '|| ' + fileName : ''}`);
                    if (arrayDados.length < SQL_LIMIT) break;
                    offset = offset + SQL_LIMIT;

                }


                resolve(true);

            } catch (error) {

                const rsltLogsRegister = await fnGerarLogs({
                    cnpj_cliente: this.cnpj_empresa,
                    nome_arquivo: null,
                    error: true,
                    entidade: "motoristas",
                    quantidade: null,
                    categoria: "SINCRONIZACAO_DADOS_MOTORISTAS_ERRO",
                    data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                    mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
                });
                resolve({ error: true, message: error.message });
            }
        });
    }
}

>>>>>>> joey.flex
module.exports = Motoristas