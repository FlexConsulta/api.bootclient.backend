const moment = require("moment")
const { fnGerarLogs } = require("../../utils/gerarLogs.js");

class FuncionamentoBootclient {

    constructor() {
        console.log(`[i] Monitoramento funcionamento do bootclient: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {

            const __CNPJ_EMPRESA = process.env.CNPJ
            const rsltLogsRegister = await fnGerarLogs({
                cnpj_cliente: __CNPJ_EMPRESA,
                nome_arquivo: null,
                error: false,
                entidade: null,
                quantidade: null,
                categoria: "FUNCIONAMENTO_BOOTCLIENT",
                mensagem: "O sistema está funcionando normal.",
            });

        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = FuncionamentoBootclient