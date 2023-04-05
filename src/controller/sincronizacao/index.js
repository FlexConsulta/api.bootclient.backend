const moment = require('moment');
const log_sincronizacao = require('../../models/log.sincronizacao').pegarUltimoLogSincronizacao;
const pegarUmaEmpresa = require('../../models/empresa').pegarUmaEmpresa;
const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const { apiFlex } = require("../../API/api.js");
const { decryptApiResponse } = require('../../utils/decryptApiResponse');
const { CNPJ, DATAINICIAL } = process.env;

module.exports = async (req, res) => {

      const empresa = await apiFlex.get(`/connection/?cnpj=${CNPJ}`)
      const data_empresa = decryptApiResponse(empresa.data.data);

      if (res && !empresa) res.status(404).send('Nenhuma empresa foi cadastrada!')
      if (!empresa) {
            console.log('Nenhuma empresa foi cadastrada!')
            return;
      }

      const dt = empresa?.datasincronizacao || null
      datasincronizacao = dt && moment(dt, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).isValid()
            ? moment(dt, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm") : null;

      const logs = await apiFlex.get(`/bootclient/log/last?cnpj=${CNPJ}`);
      Promise.all([
            new Motoristas(logs.data["motoristas"].data || null, data_empresa),
            // new Proprietarios(logs["proprietarios"].data || null),
            // new Veiculos(logs["veiculos"].data || null),
            // new Viagens(logs["viagens"].data || DATAINICIAL),
      ]).then(data => {
            if (res) res.status(202).send()
            console.log('Sincronização concluída com sucesso!');
      }).catch(error => {
            console.log(error);
      })


}