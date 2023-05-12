const chokidar = require('chokidar');
const moment = require("moment")
require('moment/locale/pt-br')
const upath = require('upath');

const { EventEmitter } = require("events");

const { FOLDER_SYNC_SUCCESS } = process.env
const envioFtp = require('./envio.ftp');
const tratamento_arquivos = require('./tratamento.arquivos');


class MonitoramentoArquivosDeDados {

    constructor(data) {
        this.Inicio()
        console.log(`[:] Monitoramento arquivos sincronização: ${moment(data).tz('America/Sao_Paulo').format('LLL')}`)
    }


    async Inicio() {

        try {

            const event = new EventEmitter();

            // Monitoramento pasta dados corretos
            await chokidar.watch(FOLDER_SYNC_SUCCESS, { persistent: true, paths: '//' }).on('add', (pathUrl, path) => {
                event.emit('sendFiles', pathUrl);
            }).on('error', error => console.log(`Watcher error: ${error}`))

            // Evento de envio
            await event.on('sendFiles', async (values) => {

                try {

                    const destination = upath.toUnix(values)
                    const resultadoEnvio = await envioFtp(destination)
                    if (resultadoEnvio?.data?.code == 226) await tratamento_arquivos({ values, destination })

                } catch (error) {
                    console.log(error);
                }
            })

        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = MonitoramentoArquivosDeDados
