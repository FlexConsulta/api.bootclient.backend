const sequelizePostgres = require('../../services/sequelize.service');
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment")

class Proprietarios {
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
          const aDayAgo = moment().subtract(1, "days").startOf("day").add(1, "minutes").format("YYYY/MM/DD HH:mm");
          _sql = _sql.replace("[$]", aDayAgo);
        } else _sql = this.dbSQL.countAll;

        const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
        const sql_result = await resultadoSequelize.obterDados(_sql);

        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: this.cnpj_empresa,
          nome_arquivo: null,
          error: false,
          entidade: "proprietarios",
          quantidade: sql_result[0].count,
          categoria: "dados_estatisticos",
          mensagem: "coleta de dados estatísticos concluída com sucesso!",
        });

        resolve(true);
      } catch (error) {
         const rsltLogsRegister = await fnGerarLogs({
           cnpj_cliente: this.cnpj_empresa,
           nome_arquivo: null,
           error: true,
           entidade: "proprietarios",
           quantidade: null,
           categoria: "dados_estatisticos_erro",
           mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
         });
        console.log({ rsltLogsRegister });
        resolve({ error: true, message: error.message });
      }
    });
  }
}

module.exports = Proprietarios;