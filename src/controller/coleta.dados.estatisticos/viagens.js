const sequelizePostgres = require('../../services/sequelize.service');
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment");
const { formatarData } = require('../../utils/tratamento.dados');
const { DATAINICIAL } = process.env;

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
        // throw new Error("Error manual")

        let _sql;
        if (this.log) {
          _sql = this.dbSQL.countLastDay;
          const data_query = formatarData(this.log.data);
          _sql = _sql.replace("[$]", data_query);
        } else {
          _sql = this.dbSQL.countAll;
          _sql = _sql.replace("[$]", DATAINICIAL);
        }

        const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
        const sql_result = await resultadoSequelize.obterDados(_sql);

        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: this.cnpj_empresa,
          nome_arquivo: null,
          error: false,
          entidade: "viagens",
          quantidade: sql_result[0].count,
          categoria: "dados_estatisticos",
          data: moment().format("YYYY-MM-DD HH:mm:ss"),
          mensagem: "coleta de dados estatísticos concluída com sucesso!",
        });

        resolve(true);
      } catch (error) {
         const rsltLogsRegister = await fnGerarLogs({
           cnpj_cliente: this.cnpj_empresa,
           nome_arquivo: null,
           error: true,
           entidade: "viagens",
           quantidade: null,
           categoria: "dados_estatisticos_erro",
           data: moment().format("YYYY-MM-DD HH:mm:ss"),
           mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
         });
        console.log({ rsltLogsRegister });
        resolve({ error: true, message: error.message });
      }
    });
  }
}

module.exports = Viagens;