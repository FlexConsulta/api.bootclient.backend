const moment = require("moment");
const schedule = require("node-schedule");
const verificacao = require("../verificar.entidades");

moment.locale("pt-br");
const { JOB_VERIFICACAO_AUTO } = process.env;

class VerificacaoAutomatica {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          verificacao();
          console.log(`[i] Verificação: ${moment().format("LLL")}`);
        };

        fn();
        schedule.scheduleJob(JOB_VERIFICACAO_AUTO || "*/4 * * * *", fn);
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = VerificacaoAutomatica;
