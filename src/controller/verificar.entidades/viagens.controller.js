const sequelizePostgres = require("../../services/sequelize.service");
const { fnGerarLogs } = require("../../utils/gerarLogs.js");

class Viagens {
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
      const resultadoSequelize = await new sequelizePostgres(
        this.dbObjectConnection
      );
      const arrayDados = await resultadoSequelize.obterDados(this.dbSQL.count);

      if (Number(arrayDados[0]?.count) > 0) {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: this.cnpj_empresa,
          nome_arquivo: null,
          error: false,
          entidade: "viagens",
          quantidade: arrayDados[0]?.count,
          categoria: "VERIFICACAO_ENTIDADE_VIAGENS",
          mensagem: `A entidade está funcionando!`,
        });
        console.log({ rsltLogsRegister });
      } else {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: this.cnpj_empresa,
          nome_arquivo: null,
          error: true,
          entidade: "viagens",
          quantidade: "1",
          categoria: "VERIFICACAO_ENTIDADE_VIAGENS",
          mensagem: `A entidade NÃO funciona!`,
        });
        console.log({ rsltLogsRegister });
      }

      resolve(true);
    });
  }
}

module.exports = Viagens;
