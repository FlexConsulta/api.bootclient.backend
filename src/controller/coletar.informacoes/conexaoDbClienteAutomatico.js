
const moment = require("moment");
const schedule = require("node-schedule");
const ConexaoDbCliente = require("./conexaoDbCliente");

moment.locale("pt-br");
const { JOB_DB_CONNECTION_AUTO } = process.env;

class ConexaoDbClienteAutomatico {
  constructor() {
    (async () => {
      try {
        schedule.gracefulShutdown();
        const fn = () => {
          console.log(`[i] Monitoramento db connection AUTO: ${moment().format("LLLL")}`);
          new ConexaoDbCliente();
        };

        fn();
        schedule.scheduleJob(JOB_DB_CONNECTION_AUTO || "*/2 * * * *", fn);
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = ConexaoDbClienteAutomatico;