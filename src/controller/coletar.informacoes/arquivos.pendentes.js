const fs = require("fs")
const moment = require("moment")
const path = require("path")
const { fnGerarLogs } = require("../../utils/gerarLogs.js");

class MonitoramentoArquivosNaoEnviados {

    constructor() {
        console.log(`[i] Monitoramento de arquivos não enviados: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {
            const pathFiles = process.env.FOLDER_SYNC_SUCCESS
            const __CNPJ_EMPRESA = process.env.CNPJ
            const listFiles = fs.readdirSync(pathFiles)
            const arrayListFiles = []

            for (let idx = 0; idx < listFiles.length; idx++) {
                const file = listFiles[idx];

                const filePath = path.join(pathFiles, file);
                const stats = fs.statSync(filePath);

                const { size, birthtime } = stats
                arrayListFiles.push({ file, size, birthtime })
                const dateNow = moment().utcOffset(0).valueOf()
                if (size > 0) {
                    const dateDue = moment(birthtime).utcOffset(0).add(1, "hour").valueOf()
                    if (dateNow > dateDue) arrayListFiles.push({ file, size, birthtime })
                }
            }

            console.log({ __CNPJ_EMPRESA });
            await fnGerarLogs({
                cnpj_client: __CNPJ_EMPRESA,
                nome_arquivo: "JSON.stringify(arrayListFiles)",
                error: true,
                entidade: "ALL",
                quantidade: String(arrayListFiles.length),
                categoria: "ARQUIVOS_PENDENTES_DE_ENVIO",
                mensagem: "Tem arquivos na pasta que não foram enviados para o servidor da flex consulta.",
            });

        } catch (error) {
            console.log({ error });
        }
    }
}
module.exports = MonitoramentoArquivosNaoEnviados
