const moment = require('moment');
const log_sincronizacao = require('../../models/log.sincronizacao').pegarUltimoLogSincronizacao;
const pegarUmaEmpresa = require('../../models/empresa').pegarUmaEmpresa;
const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');

module.exports = async (req, res) => {

      let empresa = await pegarUmaEmpresa()
      const _DATAINICIAL = process.env.dtInitTravelDefault

      if (res && !empresa) res.status(404).send('Nenhuma empresa foi cadastrada!')
      if (!empresa) {
            console.log('Nenhuma empresa foi cadastrada!')
            return;
      }

      const dt = empresa?.datasincronizacao || null

      datasincronizacao = dt && moment(dt, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).isValid()
            ? moment(dt, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm") : null;


      const log_motorista = await log_sincronizacao({ tipo: "SYNCz_MOTORISTAS" })
      const log_proprietario = await log_sincronizacao({ tipo: "SYNCz_PROPRIETARIOS" })
      const log_veiculos = await log_sincronizacao({ tipo: "SYNCz_VEICULOS" })
      const log_viagens = await log_sincronizacao({ tipo: "SYNCz_VIAGENS" })

      Promise.all([
            new Motoristas(log_motorista?.data || null),
            new Proprietarios(log_proprietario?.data || null),
            new Veiculos(log_veiculos?.data || null),
            new Viagens(log_viagens?.data || _DATAINICIAL),
      ]).then(data => {
            if (res) res.status(202).send()
            console.log('Sincronização concluída com sucesso!');
      }).catch(error => {
            console.log(error);
      })


}