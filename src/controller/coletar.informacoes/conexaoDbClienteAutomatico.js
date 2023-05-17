const moment = require("moment");
const schedule = require("node-schedule");
const ConexaoDbCliente = require("./conexaoDbCliente");

moment.locale("pt-br");
const { JOB_DB_CONNECTION_AUTO } = process.env;

class ConexaoDbClienteAutomatico {
  constructor() {
    (async () => {
      try {
        process.on("SIGINT", function () {
          schedule.gracefulShutdown().then(() => process.exit(0));
        });
        const fn = () => {
          console.log(`[i] DB connection AUTO: ${moment().tz('America/Sao_Paulo').format("LLLL")}`);
          new ConexaoDbCliente();
        };

        fn();
        schedule.scheduleJob(JOB_DB_CONNECTION_AUTO || "* 4 * * *", () => fn());
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = ConexaoDbClienteAutomatico;