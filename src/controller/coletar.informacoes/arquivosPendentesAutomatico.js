const moment = require("moment");
const schedule = require("node-schedule");
const MonitoramentoArquivosNaoEnviados = require("./arquivos.pendentes");

moment.locale("pt-br");
const { JOB_ARQUIVOS_NAO_ENVIADOS_AUTO } = process.env;

class MonitoramentoArquivosNaoEnviadosAutomatico {
  constructor() {
    (async () => {
      try {
        process.on("SIGINT", function () {
          schedule.gracefulShutdown().then(() => process.exit(0));
        });
        const fn = () => {
          console.log(`[i] Monitoramento de arquivos não enviados AUTO: ${moment().tz('America/Sao_Paulo').format("LLLL")}`);
          new MonitoramentoArquivosNaoEnviados();
        };

        fn();
        schedule.scheduleJob(JOB_ARQUIVOS_NAO_ENVIADOS_AUTO || '* 4 * * *', () => fn());
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = MonitoramentoArquivosNaoEnviadosAutomatico;
