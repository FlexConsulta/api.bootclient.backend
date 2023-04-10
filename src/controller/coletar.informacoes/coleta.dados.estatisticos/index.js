const moment = require("moment")
const getInfoCompany = require("../../../utils/get.info.company.js");
const { apiFlex } = require("../../../API/api.js");
const Motoristas = require("./motoristas.js");
const Proprietarios = require("./proprietarios.js");
const Veiculos = require("./veiculos.js");
const Viagens = require("./viagens.js");

class ColetaDadosEstatisticos {

    constructor() {
        console.log(`[i] Monitoramento funcionamento do bootclient: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {
            const { dbObjectConnection, data_empresa } = await getInfoCompany()

            const logs = await apiFlex.get(`bootclient/log/last?cnpj=${data_empresa.cnpj_empresa}`);
            const { motoristas, proprietarios, veiculos, viagens } = logs.data

            Promise.all([
              new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, lastSyncDate: motoristas?.data }),
              new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, lastSyncDate: proprietarios?.data }),
              new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, lastSyncDate: veiculos?.data }),
              new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, lastSyncDate: viagens?.data }),
            ]).then((data) => {
                console.log("Coleta de dados estatísticos concluída com sucesso!");
            }).catch((error) => {
                console.log(error);
            });
        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = ColetaDadosEstatisticos;