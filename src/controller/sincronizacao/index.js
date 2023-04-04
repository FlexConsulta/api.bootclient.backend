const moment = require('moment');
const log_sincronizacao = require('../../models/log.sincronizacao').pegarUltimoLogSincronizacao;
const pegarUmaEmpresa = require('../../models/empresa').pegarUmaEmpresa;
const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const { apiFlex } = require("../../API/api.js");
const { decryptApiResponse } = require("../../utils/decryptApiResponse");
const { CNPJ } = process.env;

module.exports = async (req, res) => {
      const empresa = await apiFlex.get("/connection/?cnpj="+CNPJ)
            .then((response) => {
            const data = decryptApiResponse(response.data.data);
            return data
            })
            .catch((error) => {
            console.log({ error, Where: "Sync Index Get Empresa" });
            });

      // const logs = await apiFlex.get("/bootclient/log/last/?cnpj=42.520.419/0001-14")
      //       .then((response) => {
      //       const data = decryptApiResponse(response.data.data);
      //       return data
      //       })
      //       .catch((error) => {
      //       console.log({ error, Where: "ClientDataReq controller" });
      //       });

      const _DATAINICIAL = process.env.dtInitTravelDefault

      if (res && !empresa) res.status(404).send('Nenhuma empresa foi cadastrada!')
      if (!empresa) {
            console.log('Nenhuma empresa foi cadastrada!')
            return;
      }

      const dt = empresa?.datasincronizacao || null

      datasincronizacao = dt && moment(dt, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).isValid()
            ? moment(dt, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm") : null;


      // const log_proprietario = await log_sincronizacao({ tipo: "SYNCz_PROPRIETARIOS" })
      // const log_veiculos = await log_sincronizacao({ tipo: "SYNCz_VEICULOS" })
      // const log_viagens = await log_sincronizacao({ tipo: "SYNCz_VIAGENS" })

      Promise.all([
            new Motoristas(empresa || null),
            // new Proprietarios(log_proprietario?.data || null),
            // new Veiculos(log_veiculos?.data || null),
            // new Viagens(log_viagens?.data || _DATAINICIAL),
      ]).then(data => {
            if (res) res.status(202).send()
            console.log('Sincronização concluída com sucesso!');
      }).catch(error => {
            console.log(error);
      })


}