const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const { apiFlex } = require("../../API/api.js");
const { decryptApiResponse } = require('../../utils/decryptApiResponse');
const { CNPJ } = process.env;

module.exports = async (req, res) => {
    const empresa = await apiFlex.get(`/connection/?cnpj=${CNPJ}`);
    const data_empresa = decryptApiResponse(empresa.data.data);

    if (res && !empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");
    if (!empresa) {
        console.log("Nenhuma empresa foi cadastrada!");
        return;
    }

    if (!data_empresa?.ativo) {
        console.log(`A empresa [${data_empresa.nomefantasia_empresa}] foi desativada!`);
        return;
    }

    const dbObjectConnection = {
        nome_banco: data_empresa.banco_server,
        usuario_banco: data_empresa.usuario_server,
        senha_banco: data_empresa.senha_server,
        host_banco: data_empresa.url_server,
        dialect: data_empresa.tipo_banco,
        porta_banco: Number(data_empresa.porta_server),
    }

    const logs = await apiFlex.get(`bootclient/log/last?cnpj=${data_empresa.cnpj_empresa}`);
    const { motoristas, proprietarios, veiculos, viagens } = logs.data

    Promise.all([
        new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, lastSyncDate: motoristas.data }),
        new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, lastSyncDate: proprietarios.data }),
        new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, lastSyncDate: veiculos.data }),
        new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, lastSyncDate: viagens.data }),
    ]).then((data) => {
        if (res) res.status(202).send();
        console.log("Sincronização concluída com sucesso!");
    }).catch((error) => {
        console.log(error);
    });
}
