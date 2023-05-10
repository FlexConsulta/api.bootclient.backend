const sequelizePostgres = require("../../services/sequelize.service");
const moment = require("moment");
const { fnGerarLogs } = require("../../utils/gerarLogs.js");

class Proprietarios {
  constructor({ dbObjectConnection, cnpj_empresa, dbSQL }) {
    this.dbObjectConnection = dbObjectConnection;
    this.cnpj_empresa = cnpj_empresa;
    this.dbSQL = JSON.parse(dbSQL);
    return new Promise(async (resolve) => {
      await this.verificar();
      resolve(true);
    });
  }

  async verificar() {
    return new Promise(async (resolve) => {
      try {
        // throw new Error("Error manual");

        const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
        const arrayDados = await resultadoSequelize.obterDados(this.dbSQL.working_table);

        let rsltLogsRegister;

        if (arrayDados?.length > 0) {
          rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: this.cnpj_empresa,
            nome_arquivo: null,
            error: false,
            entidade: "proprietarios",
            quantidade: String(arrayDados?.length),
            categoria: "VERIFICACAO_ENTIDADE",
            data: moment().format("YYYY-MM-DD HH:mm:ss"),
            mensagem: `A entidade está funcionando!`,
          });
        } else {
          rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: this.cnpj_empresa,
            nome_arquivo: null,
            error: true,
            entidade: "proprietarios",
            quantidade: String(arrayDados?.length),
            categoria: "VERIFICACAO_ENTIDADE",
            data: moment().format("YYYY-MM-DD HH:mm:ss"),
            mensagem: `A query SQL tem resltado menor que 1!`,
          });
        }

        resolve(true);
      } catch (error) {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: this.cnpj_empresa,
          nome_arquivo: null,
          error: true,
          entidade: "proprietarios",
          quantidade: null,
          categoria: "VERIFICACAO_ENTIDADE_ERRO",
          data: moment().format("YYYY-MM-DD HH:mm:ss"),
          mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
        });
        console.log({ rsltLogsRegister });
        resolve({ error: true, message: error.message });
      }
    });
  }
}

module.exports = Proprietarios;
