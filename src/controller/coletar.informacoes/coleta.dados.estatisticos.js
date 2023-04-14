const moment = require("moment")
const sequelizePostgres = require("../../services/sequelize.service");
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company");
const { apiFlex } = require("../../API/api");
const { CNPJ, DATAINICIAL } = process.env;

class ColetaDadosEstatisticos {
    constructor() {
        this.start()
    }

    async start() {
      try {
        // throw new Error("Error manual");

        const { dbObjectConnection, data_empresa } = await getInfoCompany();
        let sqls = {
            count_motoristas: JSON.parse(data_empresa.sql_motoristas).countLastDay,
            count_proprietarios: JSON.parse(data_empresa.sql_proprietarios).countLastDay,
            count_veiculos: JSON.parse(data_empresa.sql_veiculos).countLastDay,
            count_viagens: JSON.parse(data_empresa.sql_viagens).countLastDay,
        };

        const logs = await apiFlex.get(`/bootclient/log/last/estatistico?cnpj=${data_empresa.cnpj_empresa}`);
        const dados_estatisticos = logs.data

        const aDayAgo = moment().subtract(1, 'days').startOf('day').add(1, 'minutes').format("YYYY/MM/DD HH:mm")

        let data
        dados_estatisticos ? (data = aDayAgo) : (data = DATAINICIAL);

        const arraySqls = [];

        for (const key in sqls) {
          let sql = sqls[key];
          sql = sql.replace("[$]", data);
          const resultadoSequelize = await new sequelizePostgres(dbObjectConnection);
          const query_result = await resultadoSequelize.obterDados(sql);
          arraySqls.push({ [key]: query_result[0].count });
        }

        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: data_empresa.cnpj_empresa,
          nome_arquivo: null,
          error: false,
          entidade: null,
          quantidade: JSON.stringify(arraySqls),
          categoria: "dados_estatisticos",
          mensagem: "coleta de dados estatísticos concluída com sucesso!",
        });

      } catch (error) {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: CNPJ,
          nome_arquivo: null,
          error: true,
          entidade: null,
          quantidade: null,
          categoria: "dados_estatisticos_erro",
          mensagem: error && error.message ? JSON.stringify({ error: error.message }): null,
        });
        console.log({ rsltLogsRegister });
      }
    }
}

module.exports = ColetaDadosEstatisticos;