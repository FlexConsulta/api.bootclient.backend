const moment = require("moment")
const sequelizePostgres = require("../../../services/sequelize.service");
const { fnGerarLogs } = require("../../../utils/gerarLogs.js");
const { DATAINICIAL } = process.env;

class Proprietarios {
  constructor({ dbObjectConnection, cnpj_empresa, dbSQL, lastSyncDate }) {
    this.dbObjectConnection = dbObjectConnection;
    this.cnpj_empresa = cnpj_empresa;
    this.dbSQL = JSON.parse(dbSQL);
    this.lastSyncDate = lastSyncDate;
    return new Promise(async (resolve) => {
      await this.coletar();
      resolve(true);
    });
  }

  async coletar() {
    return new Promise(async (resolve) => {

      // results
      let sql_proprietarios = [];

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
        sql_proprietarios.push(query.length);
      }

      const rsltLogsRegister = await fnGerarLogs({
        cnpj_cliente: this.cnpj_empresa,
        nome_arquivo: null,
        error: false,
        entidade: "proprietarios",
        quantidade: `[${String(sql_proprietarios)}]`,
        categoria: "DADOS_ESTATISTICOS_PROPRIETARIOS",
        mensagem:"coleta de dados estatísticos dos proprietarios concluída com sucesso!",
      });
      console.log({ rsltLogsRegister });

      resolve(true);
    });
  }
}

module.exports = Proprietarios;