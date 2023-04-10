const moment = require("moment")
const getInfoCompany = require("../../../utils/get.info.company.js");
const { apiFlex } = require("../../../API/api.js");
const Motoristas = require("./motoristas.js");
const Proprietarios = require("./proprietarios.js");
const Veiculos = require("./veiculos.js");
const Viagens = require("./viagens.js");

class ColetaDadosEstatisticos {

    constructor() {
        console.log(`[i] Monitoramento funcionamento do bootclient: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {
            const { dbObjectConnection, data_empresa } = await getInfoCompany()

            // {
            //     count_motoristas:"SELECT * ..."
            //     count_PROPRIETARIOS:"SELECT * ..."
            //     ...
            // }


            return


            

            // sql query p/ cada sql
            for (let key in this.dbSQL) {

                // fznd sql com base no last log ou data inicial
                const _SQL = this.dbSQL[key].replace(
                    "[$]",
                    moment(this.lastSyncDate, [
                        "DD/MM/YYY HH:mm",
                        "YYYY/MM/DD HH:mm",
                    ]).format("YYYY/MM/DD HH:mm") || DATAINICIAL
                );
                const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
                const query = await resultadoSequelize.obterDados(_SQL);
                sql_motoristas.push(query.length);
            }

            const rsltLogsRegister = await fnGerarLogs({
                cnpj_cliente: this.cnpj_empresa,
                nome_arquivo: null,
                error: false,
                entidade: "DADOS_ESTATISTICOS",
                quantidade: `[${String(sql_motoristas)}]`,
                categoria: "DADOS_ESTATISTICOS_MOTORISTAS",
                mensagem: "coleta de dados estatísticos dos motoristas concluída com sucesso!",
            });
            console.log({ rsltLogsRegister });

            Promise.all([
                new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, lastSyncDate: motoristas?.data }),
                new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, lastSyncDate: proprietarios?.data }),
                new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, lastSyncDate: veiculos?.data }),
                new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, lastSyncDate: viagens?.data }),
            ]).then((data) => {
                console.log("Coleta de dados estatísticos concluída com sucesso!");
            }).catch((error) => {
                console.log(error);
            });
        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = ColetaDadosEstatisticos;