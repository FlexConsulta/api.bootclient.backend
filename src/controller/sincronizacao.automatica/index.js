const moment = require("moment");
const schedule = require("node-schedule");
const sincronizacao = require("../sincronizacao");

moment.locale("pt-br");
const { JOB_SINCRONIZACAO_AUTO } = process.env;

class SincronizacaoAutomatica {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          sincronizacao();
          console.log(`[i] Sincronizando: ${moment().format("LLL")}`);
        };

        fn();
        schedule.scheduleJob(JOB_SINCRONIZACAO_AUTO || "*/2 * * * *", fn);
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = SincronizacaoAutomatica;
