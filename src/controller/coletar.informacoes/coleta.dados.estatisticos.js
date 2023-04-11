const moment = require("moment")
const sequelizePostgres = require("../../services/sequelize.service");
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company");
const { CNPJ } = process.env;

class ColetaDadosEstatisticos {

    constructor() {
        this.start()
    }

    async start() {
      try {
        throw new Error("Error manual");

        const { dbObjectConnection, data_empresa } = await getInfoCompany();
        let sqls = {
          count_motoristas: JSON.parse(data_empresa.sql_motoristas).countAll,
          count_proprietarios: JSON.parse(data_empresa.sql_proprietarios).countAll,
          count_veiculos: JSON.parse(data_empresa.sql_veiculos).countAll,
          count_viagens: JSON.parse(data_empresa.sql_viagens).countAll,
        };

        const arraySqls = [];

        for (const key in sqls) {
          let sql = sqls[key];
          const resultadoSequelize = await new sequelizePostgres(dbObjectConnection);
          const query_result = await resultadoSequelize.obterDados(sql);
          arraySqls.push({ [key]: query_result[0].count });
        }

        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: data_empresa.cnpj_empresa,
          nome_arquivo: null,
          error: false,
          entidade: "DADOS_ESTATISTICOS",
          quantidade: JSON.stringify(arraySqls),
          categoria: "DADOS_ESTATISTICOS_COUNT",
          mensagem: "coleta de dados estatísticos concluída com sucesso!",
        });

      } catch (error) {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: CNPJ,
          nome_arquivo: null,
          error: true,
          entidade: "DADOS_ESTATISTICOS",
          quantidade: null,
          categoria: "DADOS_ESTATISTICOS_ERRO",
          mensagem: error && error.message ? JSON.stringify({ error: error.message }): null,
        });
        console.log({ rsltLogsRegister });
      }
    }
}

module.exports = ColetaDadosEstatisticos;