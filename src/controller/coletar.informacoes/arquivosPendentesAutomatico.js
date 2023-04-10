const moment = require("moment");
const schedule = require("node-schedule");
const MonitoramentoArquivosNaoEnviados = require("./arquivos.pendentes");

moment.locale("pt-br");
const { JOB_ARQUIVOS_NAO_ENVIADOS_AUTO } = process.env;

class MonitoramentoArquivosNaoEnviadosAutomatico {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          console.log(`[i] Monitoramento de arquivos não enviados: ${moment().format("LLLL")}`);
          new MonitoramentoArquivosNaoEnviados();
        };

        fn();
        schedule.scheduleJob(
          JOB_ARQUIVOS_NAO_ENVIADOS_AUTO || "*/2 * * * *",
          fn
        );
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = MonitoramentoArquivosNaoEnviadosAutomatico;
