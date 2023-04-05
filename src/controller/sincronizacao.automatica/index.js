const moment = require("moment");
moment.locale("pt-br");

const { pegarUmaEmpresa } = require("../../models/empresa");
const sincronizacao = require("../sincronizacao");

const schedule = require('node-schedule');



class SincronizacaoAutomatica {

      constructor(data) {


            (async () => {

                  try {

                        schedule.gracefulShutdown();
                        // const empresa = await pegarUmaEmpresa()
                        // if (!empresa) return;

                        const fn = () => {
                              // if (!empresa) return;
                              sincronizacao()
                              console.log(`[i] Sincronizando: ${moment().format('LLL')}`);
                        }

                        fn()
                        schedule.scheduleJob(`*/30 * * * * *`, fn);

                  } catch (error) {
                        console.log({ error });
                  }
            })()

      }

}

module.exports = SincronizacaoAutomatica;
