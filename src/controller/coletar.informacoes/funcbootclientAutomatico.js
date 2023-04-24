const moment = require("moment");
const schedule = require("node-schedule");
const FuncionamentoBootclient = require("./funcionamento.bootclient");

moment.locale("pt-br");
const { JOB_FUNCIONAMENTO_BOOTCLIENT_AUTO } = process.env;

class FuncionamentoBootclientAutomatico {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          console.log(`[i] Monitoramento funcionamento do bootclient AUTO: ${moment().format("LLLL")}`);
          new FuncionamentoBootclient();
        };

        fn();
        schedule.scheduleJob(
          JOB_FUNCIONAMENTO_BOOTCLIENT_AUTO || "*/3 * * *",
          fn
        );
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = FuncionamentoBootclientAutomatico;
