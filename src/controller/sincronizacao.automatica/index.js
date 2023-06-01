<<<<<<< HEAD
const moment = require("moment");
const schedule = require("node-schedule");
const sincronizacao = require("../sincronizacao");

moment.locale("pt-br");
const { JOB_SINCRONIZACAO_AUTO } = process.env;

class SincronizacaoAutomatica {
  constructor() {
    (async () => {
      try {
        process.on("SIGINT", function () {
          schedule.gracefulShutdown().then(() => process.exit(0));
        });
        
        const fn = () => {
          sincronizacao();
          console.log(`[i] Sincronizando AUTO: ${moment().tz('America/Sao_Paulo').format("LLL")}`);
        };

        fn()
        schedule.scheduleJob(JOB_SINCRONIZACAO_AUTO || '* 4 * * *', () => fn());
      } catch (error) {
        console.log({ error });
      }
    })();
  }
}

module.exports = SincronizacaoAutomatica;
=======
const moment = require("moment");
const schedule = require("node-schedule");
const sincronizacao = require("../sincronizacao");

moment.locale("pt-br");
const { JOB_SINCRONIZACAO_AUTOMATICA } = process.env;

class SincronizacaoAutomatica {
    constructor() {
        (async () => {
            try {
                process.on("SIGINT", function () {
                    schedule.gracefulShutdown().then(() => process.exit(0));
                });

                const fn = () => {
                    sincronizacao();
                    console.log(`[i] Sincronizando AUTO: ${moment().tz('America/Sao_Paulo').format("LLL")}`);
                };

                fn()
                schedule.scheduleJob(JOB_SINCRONIZACAO_AUTOMATICA || '* 4 * * *', () => fn());
            } catch (error) {
                console.log({ error });
            }
        })();
    }
}

module.exports = SincronizacaoAutomatica;
>>>>>>> joey.flex
