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
        throw new Error("Error manual")

        const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
        const arrayDados = await resultadoSequelize.obterDados(this.dbSQL.count);

        if (Number(arrayDados[0]?.count) > 0) {
          const rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: this.cnpj_empresa,
            nome_arquivo: null,
            error: false,
            entidade: "motoristas",
            quantidade: arrayDados[0]?.count,
            categoria: "VERIFICACAO_ENTIDADE_MOTORISTAS",
            mensagem: `A entidade motoristas está funcionando!`,
          });
        } else {
          const rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: this.cnpj_empresa,
            nome_arquivo: null,
            error: true,
            entidade: "motoristas",
            quantidade: null,
            categoria: "VERIFICACAO_ENTIDADE_MOTORISTAS",
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
          categoria: "VERIFICACAO_ENTIDADE_MOTORISTAS_ERRO",
          mensagem: (error && error.message) ? JSON.stringify({ error: error.message }) : null,
        });
        console.log({ rsltLogsRegister });
        resolve({ error: true, message: error.message });
      }
    });
  }
}

module.exports = Motoristas;
