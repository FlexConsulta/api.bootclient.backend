const moment = require('moment');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao')
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const { apiFlex } = require('../../API/api.js');
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS, DATAINICIAL } = process.env;

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

      // req last log
      const logs = await apiFlex.get(`bootclient/log/last?cnpj=${this.empresa.cnpj_empresa}`);
      const lastSyncDate = logs.data["viagens"].data;

      // sql json -> obj
      let SQL_object = this.empresa.sql_viagens;
      SQL_object = JSON.parse(SQL_object)

      // definir sql
      let SQL;
      if(lastSyncDate){
         SQL = SQL_object.setByDataFiltred;
         const data_query = moment(lastSyncDate, [ "DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm",]).format("YYYY/MM/DD HH:mm");
         SQL = SQL.replace("[$]", data_query);
      }else{
         SQL = SQL_object.setByData;
         const data_query = moment(DATAINICIAL, [ "DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm",]).format("YYYY/MM/DD HH:mm");
         SQL = SQL.replace("[$]", data_query);
      }

      let offset = 0;
      
      for (let i = 0; ; i++) {
        // SETAR SQL
        const _sql = `${SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;

        // get dados
        const resultadoSequelize = await new sequelizePostgres(dataConexao);
        const arrayDados = await resultadoSequelize.obterDados(_sql);

        // encripta
        const dataEncriptado = await encryptedData(arrayDados);

        if (arrayDados?.length > 0){
          // gerar arquivo
          await this.fnGeradorArquivos(
            dataEncriptado,
            "SYNCz_VIAGENS",
            this.empresa.cnpj_empresa,
            FOLDER_SYNC_SUCCESS
          );

          // gerar log
          await fnGerarLogs(
            this.empresa.cnpj_empresa,
            "SYNCz_VIAGENS",
            false,
            "viagens",
            arrayDados.length
          );
        }

        console.log(`[VIAGENS X] || ${arrayDados?.length || 0}`);
        if (arrayDados.length < SQL_LIMIT) break;
        offset += SQL_LIMIT;
      }

      resolve(true);
    });
  }
}

module.exports = Viagens