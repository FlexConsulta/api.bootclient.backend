const moment = require("moment");
const schedule = require("node-schedule");
const ColetaDadosEstatisticos = require("../coleta.dados.estatisticos/index.js");

moment.locale("pt-br");
const { JOB_COLETA_AUTO } = process.env;

class ColetaDadosEstatisticosAutomatica {
  constructor() {
    (async () => {
      try {
        process.on("SIGINT", function () {
          schedule.gracefulShutdown().then(() => process.exit(0));
        });
        const fn = () => {
          console.log(
            `[i] Coleta de dados estatísticos AUTO: ${moment().tz('America/Sao_Paulo').format("LLL")}`
          );
          ColetaDadosEstatisticos();
        };

        fn();
        schedule.scheduleJob(JOB_COLETA_AUTO || "/5 * * ", () => fn());
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = ColetaDadosEstatisticosAutomatica;
