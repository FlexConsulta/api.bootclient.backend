const sequelizePostgres = require("../../services/sequelize.service");
const { fnGerarLogs } = require("../../utils/gerarLogs.js");

class Motoristas {
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
        // throw new Error("Error manual")

        const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
        const arrayDados = await resultadoSequelize.obterDados(this.dbSQL.getOne);

        let rsltLogsRegister;

        if (arrayDados?.length > 0) {
          rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: this.cnpj_empresa,
            nome_arquivo: null,
            error: false,
            entidade: "motoristas",
            quantidade: String(arrayDados?.length),
            categoria: "VERIFICACAO_ENTIDADE",
            mensagem: `A entidade motoristas está funcionando!`,
          });
        } else {
          rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: this.cnpj_empresa,
            nome_arquivo: null,
            error: true,
            entidade: "motoristas",
            quantidade: String(arrayDados?.length),
            categoria: "VERIFICACAO_ENTIDADE",
            mensagem: `A query SQL tem resltado menor que 1!`,
          });
        }

        resolve(true);
      } catch (error) {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: this.cnpj_empresa,
          nome_arquivo: null,
          error:  true,
          entidade: "motoristas",
          quantidade: null,
          categoria: "VERIFICACAO_ENTIDADE_ERRO",
          mensagem: (error && error.message) ? JSON.stringify({ error: error.message }) : null,
        });
        console.log({ rsltLogsRegister });
        resolve({ error: true, message: error.message });
      }
    });
  }
}

module.exports = Motoristas;
