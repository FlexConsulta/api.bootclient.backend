const { apiFlex } = require('../API/api');
const { decryptApiResponse } = require('./decryptApiResponse');
const { CNPJ } = process.env;

module.exports = async function () {
    const empresa = await apiFlex.get(`/connection/?cnpj=${CNPJ}`);
    const data_empresa = decryptApiResponse(empresa.data.data);

    if (!empresa) {
        console.log("Nenhuma empresa foi cadastrada!");
        return null;
    }

    if (!data_empresa?.ativo) {
        console.log(`A empresa [${data_empresa.nomefantasia_empresa}] foi desativada!`);
        return null;
    }

    const dbObjectConnection = {
        nome_banco: data_empresa.banco_server,
        usuario_banco: data_empresa.usuario_server,
        senha_banco: data_empresa.senha_server,
        host_banco: data_empresa.url_server,
        dialect: data_empresa.tipo_banco,
        porta_banco: Number(data_empresa.porta_server),
    }

    return { dbObjectConnection, data_empresa }
}