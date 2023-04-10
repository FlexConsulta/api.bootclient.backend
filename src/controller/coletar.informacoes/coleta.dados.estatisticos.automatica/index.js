const moment = require("moment");
const schedule = require("node-schedule");
const ColetaDadosEstatisticos = require("../coleta.dados.estatisticos");

moment.locale("pt-br");
const { JOB_COLETA_AUTO } = process.env;

class ColetaDadosEstatisticosAutomatica {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          console.log(`[i] Coleta de dados estatísticos: ${moment().format("LLL")}`);
          new ColetaDadosEstatisticos();
        };

        fn();
        schedule.scheduleJob(JOB_COLETA_AUTO || "*/4 * * * *", fn);
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = ColetaDadosEstatisticosAutomatica;
