const moment = require("moment");
const schedule = require("node-schedule");
const verificacao = require("../verificar.entidades");

moment.locale("pt-br");
const { JOB_VERIFICACAO_AUTO } = process.env;

class VerificacaoEntidadesAutomatica {
  constructor() {
    (async () => {
      try {
        process.on("SIGINT", function () {
          schedule.gracefulShutdown().then(() => process.exit(0));
        });
        const fn = () => {
          verificacao();
          console.log(`[i] Verificação das entidades AUTO: ${moment().tz('America/Sao_Paulo').format("LLL")}`);
        };

        fn()
        schedule.scheduleJob(JOB_VERIFICACAO_AUTO || '* 4 * * *', () => fn());
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = VerificacaoEntidadesAutomatica;
