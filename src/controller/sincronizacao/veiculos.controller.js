const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao')
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS } = process.env;

const SQL = `SELECT coalesce(veic.dataatual, veic.datainclusao) AS dataatual,
veic.placa,
veic.liberado,
veic.bloqueadoadm
FROM veiculo veic 
WHERE veic.codveiculo = (select veic2.codveiculo from veiculo veic2 where veic.placa = veic2.placa order by coalesce(veic2.dataatual, veic2.datainclusao) desc limit 1 )
ORDER BY coalesce(veic.dataatual, veic.datainclusao) ASC`;

class Veiculos extends GerarArquivo {
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

      let offset = 0;
      for (let i = 0; ; i++) {
        // SETAR SQL
        const _sql = `${SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;

        // get dados
        const resultadoSequelize = await new sequelizePostgres(dataConexao);
        const arrayDados = await resultadoSequelize.obterDados(_sql);

        // encripta
        const dataEncriptado = await encryptedData(arrayDados);

        // gerar arquivo
        await this.fnGeradorArquivos(
          dataEncriptado,
          "SYNCz_VEICULOS",
          this.empresa.cnpj_empresa,
          FOLDER_SYNC_SUCCESS
        );

        // gerar log
        if (arrayDados?.length > 0)
          await fnGerarLogs(
            this.empresa.cnpj_empresa,
            "SYNCz_VEICULOS",
            false,
            "veiculos",
            arrayDados.length
          );

        console.log(`[VEICULOS X] || ${arrayDados?.length || 0}`);
        if (arrayDados.length < SQL_LIMIT) break;
        offset += SQL_LIMIT;
      }

      resolve(true);
    });
  }
}

module.exports = Veiculos