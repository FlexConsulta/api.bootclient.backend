const moment = require("moment")
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const { CNPJ } = process.env

class FuncionamentoBootclient {

    constructor() {
        this.start()
    }

    async start() {
        try {
            // throw new Error("Error manual");

            const rsltLogsRegister = await fnGerarLogs({
              cnpj_cliente: CNPJ,
              nome_arquivo: null,
              error: false,
              entidade: null,
              quantidade: null,
              categoria: "FUNCIONAMENTO_BOOTCLIENT",
              data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
              mensagem: "O sistema está funcionando normal.",
            });

        } catch (error) {
          const rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: CNPJ,
            nome_arquivo: null,
            error: true,
            entidade: null,
            quantidade: null,
            categoria: "FUNCIONAMENTO_BOOTCLIENT_ERRO",
            data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
            mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
          });
          console.log({ rsltLogsRegister });
        }
    }
}

module.exports = FuncionamentoBootclient