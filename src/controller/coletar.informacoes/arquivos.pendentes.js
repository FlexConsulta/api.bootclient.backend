const fs = require("fs")
const moment = require("moment")
const path = require("path")
const { gerarLogsArquivos, fnGerarLogs } = require("../../utils/gerarLogs.js");
const { CNPJ } = process.env;

class MonitoramentoArquivosNaoEnviados {

    constructor() {
        this.start()
    }

    async start() {
        try {
            // throw new Error("Error manual");

            const pathFiles = process.env.FOLDER_SYNC_SUCCESS
            const __CNPJ_EMPRESA = process.env.CNPJ
            const listFiles = fs.readdirSync(pathFiles)
            const arrayListFiles = []

            for (let idx = 0; idx < listFiles.length; idx++) {
                const file = listFiles[idx];

                const filePath = path.join(pathFiles, file);
                const stats = fs.statSync(filePath);

                const { size, birthtime } = stats
                const dateNow = moment().tz('America/Sao_Paulo').utcOffset(0).valueOf()
                if (size > 0) {
                    const dateDue = moment(birthtime).tz('America/Sao_Paulo').utcOffset(0).add(1, "hour").valueOf()
                    if (dateNow > dateDue) arrayListFiles.push({ file, size, birthtime })
                }
            }
            
            const rsltLogsRegister = await gerarLogsArquivos({
                cnpj_cliente: __CNPJ_EMPRESA,
                quantidade_arquivos: arrayListFiles.length,
                nomes_arquivos: arrayListFiles,
                data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss")
            })
            
        } catch (error) {
          const rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: CNPJ,
            nome_arquivo: null,
            error: true,
            entidade: null,
            quantidade: null,
            categoria: "ARQUIVOS_PENDENDTES_ERRO",
            data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
            mensagem: error && error.message ? JSON.stringify({ error: error.message }): null,
          });
          console.log({ rsltLogsRegister });
        }
    }
}

module.exports = MonitoramentoArquivosNaoEnviados