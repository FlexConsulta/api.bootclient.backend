const sequelizePostgres = require('../../services/sequelize.service');
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment");

class Motoristas {
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


                const { only_totals, total_by_status_0, total_by_status_1, total_by_status_2, total_by_date } = this.dbSQL

                const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);

                const funcGetOnlyTotals = Promise.resolve(resultadoSequelize.obterDados(only_totals));
                const funcGetTotalByToday = () => new Promise(resolve => {
                    const date = moment().tz('America/Sao_Paulo').startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    const __total_by_date = total_by_date.replace('[$]', date)
                    resolve(resultadoSequelize.obterDados(__total_by_date))
                });
                const funcTotalByStatus0 = Promise.resolve(resultadoSequelize.obterDados(total_by_status_0));
                const funcTotalByStatus1 = Promise.resolve(resultadoSequelize.obterDados(total_by_status_1));
                const funcTotalByStatus2 = Promise.resolve(resultadoSequelize.obterDados(total_by_status_2));

                const objAux = {
                    cnpj_cliente: this.cnpj_empresa,
                    nome_arquivo: null,
                    data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                }

                Promise.all([
                    funcGetOnlyTotals,
                    funcGetTotalByToday(),
                    funcTotalByStatus0,
                    funcTotalByStatus1,
                    funcTotalByStatus2
                ]).then(async data => {

                    objAux.error = false
                    objAux.mensagem = "Coleta dos dados estatísticos concluído com sucesso!"

                    const objTotalNumMotoristas = { entidade: 'MOTORISTAS', categoria: "NUMERO_TOTAL_MOTORISTAS", quantidade: data[0][0]?.count }
                    const objTotalDiarioNumMotoristas = { entidade: 'MOTORISTAS', categoria: "NUMERO_DIARIO_TOTAL_MOTORISTAS", quantidade: data[1][0]?.count }
                    const objTotalStatusMotoristas0 = { entidade: 'MOTORISTAS', categoria: "NUMERO_STATUS_MOTORISTAS_ATIVO", quantidade: data[2][0]?.qtd }
                    const objTotalStatusMotoristas1 = { entidade: 'MOTORISTAS', categoria: "NUMERO_STATUS_MOTORISTAS_VENCIDO", quantidade: data[3][0]?.qtd }
                    const objTotalStatusMotoristas2 = { entidade: 'MOTORISTAS', categoria: "NUMERO_STATUS_MOTORISTAS_BLOQUEADO", quantidade: data[4][0]?.qtd }

                    await fnGerarLogs({ ...objTotalNumMotoristas, ...objAux })
                    await fnGerarLogs({ ...objTotalDiarioNumMotoristas, ...objAux })
                    await fnGerarLogs({ ...objTotalStatusMotoristas0, ...objAux })
                    await fnGerarLogs({ ...objTotalStatusMotoristas1, ...objAux })
                    await fnGerarLogs({ ...objTotalStatusMotoristas2, ...objAux })

                    resolve(true)
                }).catch(async error => {

                    objAux.error = true
                    objAux.mensagem = "Coleta dos dados estatísticos concluído com erro!"

                    await fnGerarLogs({ ...objTotalNumMotoristas, ...objAux })
                    resolve({ error: true, message: error?.message && JSON.stringify(error?.message) });
                })

            } catch (error) {
                await fnGerarLogs({ ...objTotalNumMotoristas, ...objAux })
                resolve({ error: true, message: error?.message && JSON.stringify(error?.message) });
            }
        });
    }
}

module.exports = Motoristas;