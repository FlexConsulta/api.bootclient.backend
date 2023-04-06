const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const { apiFlex } = require("../../API/api.js");
const { decryptApiResponse } = require('../../utils/decryptApiResponse');
const { CNPJ } = process.env;

module.exports = async (req, res) => {
      
      const empresa = await apiFlex.get(`/connection/?cnpj=${CNPJ}`)
      const data_empresa = decryptApiResponse(empresa.data.data);

      if (res && !empresa) res.status(404).send('Nenhuma empresa foi cadastrada!')
      if (!empresa) {
            console.log('Nenhuma empresa foi cadastrada!')
            return;
      }

      if (!data_empresa?.ativo) {
            console.log(`A empresa [${data_empresa.nomefantasia_empresa}] foi desativada!`)
            return;
      }

      console.log({ data_empresa });

      Promise.all([
            // new Motoristas(data_empresa),
            // new Proprietarios(data_empresa),
            // new Veiculos(data_empresa),
            // new Viagens(data_empresa),
      ]).then(data => {
            if (res) res.status(202).send()
            console.log('Sincronização concluída com sucesso!');
      }).catch(error => {
            console.log(error);
      })
}
