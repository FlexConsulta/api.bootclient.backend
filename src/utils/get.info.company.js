const { apiFlex } = require('../API/api');
const { decryptApiResponse } = require('./decryptApiResponse');
const { createInfo, getInfo } = require('../models/informacoes.model.js');
const { CNPJ } = process.env;

module.exports = async function () {
    let data_empresa;
    
    await apiFlex
      .get(`/connection/?cnpj=${CNPJ}`)
      .then(async (response) => {
        data_empresa = decryptApiResponse(response.data.data);
        await createInfo(data_empresa);
        // console.log("VIM DO REQUEST");
      })
      .catch(async () => {
        ({ data_empresa } = await getInfo());
        // console.log("VIM DO DBLOCAL")
      });
    
    if (!data_empresa) {
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