const moment = require('moment');
const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const { apiFlex } = require("../../API/api.js");
const { decryptApiResponse } = require('../../utils/decryptApiResponse');
const { CNPJ } = process.env;

module.exports = async (req, res) => {

// select 
// (SELECT count(mot.codmotorista) 
// FROM motorista mot 
// WHERE mot.codmotorista = (select mot2.codmotorista from motorista mot2 where mot.cpf = mot2.cpf 
// order by coalesce(mot2.dataatual, mot2.datainclusao) desc limit 1 ) ) as QTDMotoristas ,
// (SELECT   
// count(c.numero)
// FROM conhecimento c
// INNER JOIN motorista mot ON (c.codmotorista = mot.codmotorista)
// INNER JOIN veiculo veic ON (c.codveiculo = veic.codveiculo)
// INNER JOIN proprietario prop ON (c.codproprietario = prop.codproprietario)
// INNER JOIN mercadoria merc ON (c.codmercadoria = merc.codmercadoria)
// LEFT OUTER JOIN cidade cid ON (c.codcidadeorigem = cid.codcidade)
// LEFT OUTER JOIN cidade cidd ON (c.codcidadedestino = cidd.codcidade)
// WHERE c.data >= '01/01/2021' AND c.data <= now() AT TIME ZONE 'AST'
// AND c.tipocte IN ('0','1','2','B','D')
// ) as QTDViagens,
// (SELECT 
// count(veic.placa)
// FROM veiculo veic 
// WHERE veic.codveiculo = (select veic2.codveiculo from veiculo veic2 where veic.placa = veic2.placa order by 
// coalesce(veic2.dataatual, veic2.datainclusao) desc limit 1 )
// ) as QTDVeiculos,
// (SELECT count(prop.cgccpf)
// FROM proprietario prop 
// WHERE prop.codproprietario = (select prop2.codproprietario from proprietario prop2 where prop.cgccpf = prop2.cgccpf order by 
// coalesce(prop2.dataatual, prop2.datainclusao) desc limit 1)
// ) as QTDProprietarios,
// now()

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

      const logs = await apiFlex.get(`/bootclient/log/last?cnpj=${CNPJ}`);

      Promise.all([
            // new Motoristas(logs.data?.data || null, data_empresa),
            new Motoristas(data_empresa, logs.data["motoristas"]),
            // new Proprietarios(logs["proprietarios"]?.data || null),
            // new Veiculos(logs["veiculos"]?.data || null),
            // new Viagens(logs["viagens"]?.data || DATAINICIAL),
      ]).then(data => {
            if (res) res.status(202).send()
            console.log('Sincronização concluída com sucesso!');
      }).catch(error => {
            console.log(error);
      })


}



