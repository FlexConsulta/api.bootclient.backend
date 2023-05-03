const moment = require("moment");
const schedule = require("node-schedule");
const ColetaDadosEstatisticos = require("../coleta.dados.estatisticos/inedx.js");

moment.locale("pt-br");
const { JOB_COLETA_AUTO } = process.env;

class ColetaDadosEstatisticosAutomatica {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          console.log(
            `[i] Coleta de dados estatísticos AUTO: ${moment().format("LLL")}`
          );
          ColetaDadosEstatisticos();
        };

        fn();
        schedule.scheduleJob(JOB_COLETA_AUTO || "59 59 23 * * *", () => fn());
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = ColetaDadosEstatisticosAutomatica;
