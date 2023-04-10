const moment = require("moment")
const sequelizePostgres = require("../../../services/sequelize.service");
const { fnGerarLogs } = require("../../../utils/gerarLogs.js");
const { DATAINICIAL } = process.env;

class Viagens {
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
      let sql_viagens = [];

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
        sql_viagens.push(query.length);
      }

      const rsltLogsRegister = await fnGerarLogs({
        cnpj_cliente: this.cnpj_empresa,
        nome_arquivo: null,
        error: false,
        entidade: "viagens",
        quantidade: `[${String(sql_viagens)}]`,
        categoria: "DADOS_ESTATISTICOS_VIAGENS",
        mensagem:"coleta de dados estatísticos das viagens concluída com sucesso!",
      });
      console.log({ rsltLogsRegister });

      resolve(true);
    });
  }
}

module.exports = Viagens;