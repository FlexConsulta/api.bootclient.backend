const moment = require("moment")
const { fnGerarLogs } = require("../../utils/gerarLogs.js");

class ConexaoDbCliente {

    constructor() {
        console.log(`[i] Monitoramento funcionamento do bootclient: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {

        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = ConexaoDbCliente