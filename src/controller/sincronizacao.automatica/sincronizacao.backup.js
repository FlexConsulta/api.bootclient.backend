<<<<<<< HEAD
const moment = require("moment");
moment.locale("pt-br");

const { pegarUmaEmpresa } = require("../../models/empresa");

const schedule = require('node-schedule');

const Motoristas = require('../../controller/sincronizacao/motoristas.controller');
const Proprietarios = require('../../controller/sincronizacao/proprietarios.controller');
const Veiculos = require('../../controller/sincronizacao/veiculos.controller');
const Viagens = require('../../controller/sincronizacao/viagens.controller');

class SincronizacaoAutomatica {

      constructor() {


            (async () => {

                  try {

                        process.on("SIGINT", function () {
                        schedule.gracefulShutdown().then(() => process.exit(0));
                        });
                        const empresa = await pegarUmaEmpresa()
                        if (!empresa) return;

                        const fn = async () => {
                              if (!empresa) return;

                              const dataAnterior = moment().tz('America/Sao_Paulo').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(0, true).format()

                              Promise.all([
                                    await new Motoristas(dataAnterior),
                                    await new Proprietarios(dataAnterior),
                                    await new Veiculos(dataAnterior),
                                    await new Viagens(dataAnterior),
                              ]).then(data => {
                                    console.log(`Concluido com sucesso às: [${moment().tz('America/Sao_Paulo').format('LLLL')}]`);
                              }).catch(error => console.log(error))


                              console.log(`[i] Sincronização de backup!: ${moment().tz('America/Sao_Paulo').format('LLL')}`);
                        }

                        schedule.scheduleJob('0 0 * * *', fn);

                  } catch (error) {
                        console.log({ error });
                  }
            })()






      }

}

module.exports = SincronizacaoAutomatica;
=======
const moment = require("moment");
moment.locale("pt-br");

const getInfoCompany = require('../../utils/get.info.company');

const schedule = require('node-schedule');

const Motoristas = require('../../controller/sincronizacao/motoristas.controller');
const Proprietarios = require('../../controller/sincronizacao/proprietarios.controller');
const Veiculos = require('../../controller/sincronizacao/veiculos.controller');
const Viagens = require('../../controller/sincronizacao/viagens.controller');

class SincronizacaoAutomatica {

      constructor() {


            (async () => {

                  try {

                        process.on("SIGINT", function () {
                              schedule.gracefulShutdown().then(() => process.exit(0));
                        });
                        const { dbObjectConnection, data_empresa } = await getInfoCompany();
                        if (!data_empresa) return;

                        const fn = async () => {
                              if (!data_empresa) return;

                              const dataAnterior = moment().subtract(1, "day").tz('America/Sao_Paulo').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utcOffset(0, true).format()

                              Promise.all([
                                    await new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, lastSyncDate: dataAnterior }),
                                    await new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, lastSyncDate: dataAnterior }),
                                    await new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, lastSyncDate: dataAnterior }),
                                    await new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, lastSyncDate: dataAnterior }),
                              ]).then(data => {
                                    console.log(`Concluido com sucesso às: [${moment().tz('America/Sao_Paulo').format('LLLL')}]`);
                              }).catch(error => console.log(error))


                              console.log(`[i] Sincronização de backup!: ${moment().tz('America/Sao_Paulo').format('LLL')}`);
                        }

                        schedule.scheduleJob('0 1 * * *', fn);

                  } catch (error) {
                        console.log({ error });
                  }
            })()






      }

}

module.exports = SincronizacaoAutomatica;
>>>>>>> joey.flex
