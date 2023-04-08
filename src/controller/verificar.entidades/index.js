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
    Promise.all([
        new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas}),
        new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios}),
        new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos}),
        new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens}),
    ]).then(() => {
        if (res) res.status(202).send();
        console.log("Verificação concluída com sucesso!");
    }).catch((error) => {
        console.log(error);
    });
}
