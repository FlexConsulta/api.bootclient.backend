const fs = require("fs")
const moment = require("moment")
const path = require("path")
const { gerarLogsArquivos } = require("../../utils/gerarLogs.js");

class MonitoramentoArquivosNaoEnviados {

    constructor() {
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
                const dateNow = moment().utcOffset(0).valueOf()
                if (size > 0) {
                    const dateDue = moment(birthtime).utcOffset(0).add(1, "hour").valueOf()
                    if (dateNow > dateDue) arrayListFiles.push({ file, size, birthtime })
                }
            }

            const rsltLogsRegister = await gerarLogsArquivos({
                cnpj_cliente: __CNPJ_EMPRESA,
                quantidade_arquivos: arrayListFiles.length,
                nomes_arquivos: arrayListFiles
            })

        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = MonitoramentoArquivosNaoEnviados