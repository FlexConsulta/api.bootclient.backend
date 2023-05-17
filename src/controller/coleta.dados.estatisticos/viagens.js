const sequelizePostgres = require('../../services/sequelize.service');
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment");
const { DATAINICIAL } = process.env

class Viagens {
    constructor({ dbObjectConnection, cnpj_empresa, dbSQL, log }) {
        this.dbObjectConnection = dbObjectConnection;
        this.cnpj_empresa = cnpj_empresa;
        this.dbSQL = JSON.parse(dbSQL);
        this.log = log
        return new Promise(async (resolve) => {
            await this.verificar();
            resolve(true);
        });
    }

    async verificar() {
        return new Promise(async (resolve) => {
            try {


                let { only_totals, daily_sync, total_by_date, total_by_canceled_true, total_by_canceled_false } = this.dbSQL
                only_totals = only_totals.replace('[$]', DATAINICIAL || '2021-01-01 00:00:00');
                total_by_canceled_true = total_by_canceled_true.replace('[$]', DATAINICIAL || '2021-01-01 00:00:00');
                total_by_canceled_false = total_by_canceled_false.replace('[$]', DATAINICIAL || '2021-01-01 00:00:00');

                const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);

                const funcGetOnlyTotals = Promise.resolve(resultadoSequelize.obterDados(only_totals));
                const funcGetTotalByToday = () => new Promise(resolve => {
                    const date = moment().tz('America/Sao_Paulo').startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    const __total_by_date = total_by_date.replace('[$]', date)
                    resolve(resultadoSequelize.obterDados(__total_by_date))
                });
                const funcDailySync = () => new Promise(resolve => {
                    const date = moment().tz('America/Sao_Paulo').startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    const __daily_sync = daily_sync.replace("[$]", date);
                    resolve(resultadoSequelize.obterDados(__daily_sync));
                });
                const funcTotalByCanceledTrue = Promise.resolve(resultadoSequelize.obterDados(total_by_canceled_true));
                const funcTotalByCanceledFalse = Promise.resolve(resultadoSequelize.obterDados(total_by_canceled_false));

                const objAux = {
                    cnpj_cliente: this.cnpj_empresa,
                    nome_arquivo: null,
                    data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                }

                Promise.all([
                    funcGetOnlyTotals,
                    funcGetTotalByToday(),
                    funcDailySync(),
                    funcTotalByCanceledTrue,
                    funcTotalByCanceledFalse
                ]).then(async data => {

                    objAux.error = false
                    objAux.mensagem = "Coleta dos dados estatísticos concluído com sucesso!"

                    const objTotalNumViagens = { entidade: 'VIAGENS', categoria: "NUMERO_TOTAL_VIAGENS", quantidade: data[0][0]?.count }
                    const objTotalDiarioNumViagens = { entidade: 'VIAGENS', categoria: "NUMERO_DIARIO_TOTAL_VIAGENS", quantidade: data[1][0]?.count }
                    const objTotalDailySyncViagens = { entidade: 'VIAGENS', categoria: "NUMERO_DAILY_SYNC_VIAGENS", quantidade: data[2].length.toString() }
                    const objTotalByCanceledTrue = { entidade: 'VIAGENS', categoria: "NUMERO_VIAGENS_CANCELADAS", quantidade: data[3].length.toString() }
                    const objTotalByCanceledFalse = { entidade: 'VIAGENS', categoria: "NUMERO_VIAGENS_NAO_CANCELADAS", quantidade: data[4].length.toString() }

                    await fnGerarLogs({ ...objTotalNumViagens, ...objAux })
                    await fnGerarLogs({ ...objTotalDiarioNumViagens, ...objAux })
                    await fnGerarLogs({ ...objTotalDailySyncViagens, ...objAux })
                    await fnGerarLogs({ ...objTotalByCanceledTrue, ...objAux });
                    await fnGerarLogs({ ...objTotalByCanceledFalse, ...objAux })

                    resolve(true)

                }).catch(async error => {

                    objAux.error = true
                    objAux.mensagem = "Coleta dos dados estatísticos concluído com erro!"

                    await fnGerarLogs({ ...objTotalNumViagens, ...objAux })
                    resolve({ error: true, message: error?.message && JSON.stringify(error?.message) });
                })

            } catch (error) {
                await fnGerarLogs({ ...objTotalNumViagens, ...objAux })
                resolve({ error: true, message: error?.message && JSON.stringify(error?.message) });
            }
        });
    }
}

module.exports = Viagens;