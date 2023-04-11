const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const getInfoCompany = require('../../utils/get.info.company');
const { apiFlex } = require('../../API/api');

module.exports = async (req, res) => {

    const { dbObjectConnection, data_empresa } = await getInfoCompany()
    if (!data_empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");

    const logs = await apiFlex.get(`bootclient/log/last?cnpj=${data_empresa.cnpj_empresa}`);
    const { motoristas, proprietarios, veiculos, viagens } = logs.data

    Promise.all([
      await  new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, lastSyncDate: motoristas?.data }),
      await  new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, lastSyncDate: proprietarios?.data }),
      await  new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, lastSyncDate: veiculos?.data }),
      await  new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, lastSyncDate: viagens?.data }),
    ]).then((data) => {
        if (res) res.status(202).send();
        console.log("Sincronização concluída com sucesso!");
    }).catch((error) => {
        console.log(error);
    });
}
