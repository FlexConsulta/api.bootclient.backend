const moment = require('moment');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao')
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS, DATAINICIAL } = process.env;

const SQL = `SELECT c.data,
coalesce(c.dataatual, c.datadigitacao) AS dataatual,
c.numero,
c.cancelado,
coalesce(mot.dataatual, mot.datainclusao) AS dataatualmot,
mot.cpf AS cpfmot,
mot.nome AS nomemot,
mot.liberado AS liberadomot,
mot.bloqueadoadm AS bloqueadoadmmot,
mot.celular AS celularmot,
mot.fone AS fonemot,
coalesce(prop.dataatual, prop.datainclusao) AS dataatualprop,
prop.cgccpf AS cgccpf,
prop.nome AS nomeprop,
prop.liberado AS liberadoprop,
prop.bloqueadoadm AS bloqueadoadmprop,
coalesce(veic.dataatual, veic.datainclusao) AS dataatualveic,
veic.placa AS cavalo,
veic.liberado AS liberadoveic,
veic.bloqueadoadm AS bloqueadoadmveic,
veic.placacarreta AS carreta1,
veic.placacarreta2 AS carreta2,
veic.placacarreta3 AS carreta3,
veic.placacarreta4 AS carreta4,
merc.descricao AS mercadoria,
cid.nome AS nomecidadeorigem,
cid.uf AS ufcidadeorigem,
cidd.nome AS nomecidadedestino,
cidd.uf AS ufcidadedestino
FROM conhecimento c
INNER JOIN motorista mot ON (c.codmotorista = mot.codmotorista)
INNER JOIN veiculo veic ON (c.codveiculo = veic.codveiculo)
INNER JOIN proprietario prop ON (c.codproprietario = prop.codproprietario)
INNER JOIN mercadoria merc ON (c.codmercadoria = merc.codmercadoria)
LEFT OUTER JOIN cidade cid ON (c.codcidadeorigem = cid.codcidade)
LEFT OUTER JOIN cidade cidd ON (c.codcidadedestino = cidd.codcidade)
WHERE c.data >= '$' AND c.data <= now() AT TIME ZONE 'AST'
AND c.tipocte IN ('0','1','2','B','D')
ORDER BY c.data ASC`;

class Viagens extends GerarArquivo {
  constructor(empresa) {
    super();
    this.empresa = empresa;
    return new Promise(async (resolve) => {
      await this.sincronizar();
      resolve(true);
    });
  }

  async sincronizar() {
    return new Promise(async (resolve) => {
      const dataConexao = {
        nome_banco: this.empresa.banco_server,
        usuario_banco: this.empresa.usuario_server,
        senha_banco: this.empresa.senha_server,
        host_banco: this.empresa.url_server,
        dialect: this.empresa.tipo_banco,
        porta_banco: Number(this.empresa.porta_server),
      };

      const data = moment(DATAINICIAL, [ "DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm",]).format("YYYY/MM/DD HH:mm");
      const _SQL = SQL.replace("$", data);
      let offset = 0;
      
      for (let i = 0; ; i++) {
        // SETAR SQL
        const _sql = `${_SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;

        // get dados
        const resultadoSequelize = await new sequelizePostgres(dataConexao);
        const arrayDados = await resultadoSequelize.obterDados(_sql);

        // encripta
        const dataEncriptado = await encryptedData(arrayDados);

        // gerar arquivo
        await this.fnGeradorArquivos(
          dataEncriptado,
          "SYNCz_VIAGENS",
          this.empresa.cnpj_empresa,
          FOLDER_SYNC_SUCCESS
        );

        // gerar log
        if (arrayDados?.length > 0)
          await fnGerarLogs(
            this.empresa.cnpj_empresa,
            "SYNCz_VIAGENS",
            false,
            "viagens",
            arrayDados.length
          );

        console.log(`[VIAGENS X] || ${arrayDados?.length || 0}`);
        if (arrayDados.length < SQL_LIMIT) break;
        offset += SQL_LIMIT;
      }

      resolve(true);
    });
  }
}

module.exports = Viagens