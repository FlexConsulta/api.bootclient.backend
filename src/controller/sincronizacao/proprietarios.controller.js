const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { fnGerarLogs } = require('../../utils/gerarLogs.js');
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS } = process.env;

const SQL = `SELECT coalesce(prop.dataatual, prop.datainclusao) AS dataatual,
prop.cgccpf,
prop.nome,
prop.liberado,
prop.bloqueadoadm
FROM proprietario prop 
WHERE prop.codproprietario = (select prop2.codproprietario from proprietario prop2 where prop.cgccpf = prop2.cgccpf order by coalesce(prop2.dataatual, prop2.datainclusao) desc limit 1)
ORDER BY coalesce(prop.dataatual, prop.datainclusao) ASC`;

class Proprietarios extends GerarArquivo {
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

      const resultadoSequelize = await new sequelizePostgres(dataConexao);
      const arrayDados = await resultadoSequelize.obterDados(SQL);
      console.log({qtd_dados: arrayDados.length})

      let offset = 0;
      for (let i = 0; ; i++) {
        // SETAR SQL
        // =========================================================
        // const _sql = `${this.empresa.sql_proprietarios} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;
        const _sql = `${SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;
        // =========================================================

        // get dados
        const resultadoSequelize = await new sequelizePostgres(dataConexao);
        const arrayDados = await resultadoSequelize.obterDados(_sql);

        // encripta
        const dataEncriptado = await encryptedData(arrayDados);

        // gerar arquivo
        await this.fnGeradorArquivos(
          dataEncriptado,
          "SYNCz_PROPRIETARIOS",
          this.empresa.cnpj_empresa,
          FOLDER_SYNC_SUCCESS
        );

        // gerar log
        if (arrayDados?.length > 0)
          await fnGerarLogs(
            this.empresa.cnpj_empresa,
            "SYNCz_PROPRIETARIOS",
            false,
            "proprietarios",
            arrayDados.length
          );

        console.log(`[PROPRIETARIOS X] || ${arrayDados?.length || 0}`);
        if (arrayDados.length < SQL_LIMIT) break;
        offset += SQL_LIMIT;
      }

      resolve(true);
    });
  }
}

module.exports = Proprietarios