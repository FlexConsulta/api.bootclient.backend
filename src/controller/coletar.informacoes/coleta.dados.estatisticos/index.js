const moment = require("moment")
const getInfoCompany = require("../../../utils/get.info.company.js");
const sequelizePostgres = require("../../../services/sequelize.service");
const { fnGerarLogs } = require("../../../utils/gerarLogs.js");

class ColetaDadosEstatisticos {

    constructor() {
        console.log(`[i] Monitoramento funcionamento do bootclient: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {
          const { dbObjectConnection, data_empresa } = await getInfoCompany();
          let sqls = {
            count_motoristas: JSON.parse(data_empresa.sql_motoristas).count,
            count_proprietarios: JSON.parse(data_empresa.sql_proprietarios).count,
            count_veiculos: JSON.parse(data_empresa.sql_veiculos).count,
            count_viagens: JSON.parse(data_empresa.sql_viagens).count,
          };

          for (const key in sqls) {
            let sql = sqls[key].replace(" LIMIT 1", ";");
            const resultadoSequelize = await new sequelizePostgres(dbObjectConnection);
            const query_result = await resultadoSequelize.obterDados(sql)
            sqls[key] = query_result.length;
          }
          
          const rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: data_empresa.cnpj_empresa,
            nome_arquivo: null,
            error: false,
            entidade: "DADOS_ESTATISTICOS",
            quantidade: `count_motoristas: ${sqls.count_motoristas}, count_proprietarios: ${sqls.count_proprietarios}, count_veiculos: ${sqls.count_veiculos}, count_viagens: ${sqls.count_viagens}`,
            categoria: "DADOS_ESTATISTICOS_COUNT",
            mensagem: "coleta de dados estatísticos concluída com sucesso!",
          });
          console.log({ rsltLogsRegister });
        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = ColetaDadosEstatisticos;