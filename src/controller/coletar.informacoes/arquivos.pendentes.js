const fs = require("fs")
const moment = require("moment")
const path = require("path")

class MonitoramentoArquivosNaoEnviados {

    constructor() {
        console.log(`[i] Monitoramento de arquivos não enviados: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {
            const pathFiles = process.env.FOLDER_SYNC_SUCCESS
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

            console.log(arrayListFiles);

        } catch (error) {
            console.log({ error });
        }
    }
}
module.exports = MonitoramentoArquivosNaoEnviados
