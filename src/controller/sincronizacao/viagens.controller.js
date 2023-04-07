const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao')
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const moment = require("moment");
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS, DATAINICIAL, FILE_VERSION: filePrefix } = process.env;

class Viagens extends GerarArquivo {

    constructor({
        dbObjectConnection,
        cnpj_empresa,
        dbSQL,
        lastSyncDate
    }) {

        super();
        this.dbObjectConnection = dbObjectConnection
        this.cnpj_empresa = cnpj_empresa
        this.dbSQL = JSON.parse(dbSQL)
        this.lastSyncDate = lastSyncDate

        return new Promise(async (resolve) => {
            await this.sincronizar();
            resolve(true);
        });
    }

    async sincronizar() {
        return new Promise(async (resolve) => {

            let SQL;
            if (this.lastSyncDate) {
                SQL = this.dbSQL.setByDataFiltred;
                const data_query = moment(this.lastSyncDate, ["DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm",]).format("YYYY/MM/DD HH:mm");
                SQL = SQL.replace("[$]", data_query);
            } else {
                SQL = this.dbSQL.setByData;
                const data_query = moment(DATAINICIAL, ["DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm",]).format("YYYY/MM/DD HH:mm");
                SQL = SQL.replace("[$]", data_query);
            }

            let offset = 0;

            for (let i = 0; ; i++) {

                const _sql = `${SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset};`;

                const resultadoSequelize = await new sequelizePostgres(this.dbObjectConnection);
                const arrayDados = await resultadoSequelize.obterDados(_sql);

                const dataEncriptado = await encryptedData(arrayDados);

                const convertedCNPJ = String(this.cnpj_empresa).replaceAll(/\D/g, '')
                const fileName = `${filePrefix}_VIAGENS_${convertedCNPJ}_${moment().valueOf()}`
                if (arrayDados?.length > 0) {
                    await this.fnGeradorArquivos(
                        dataEncriptado,
                        fileName,
                        this.cnpj_empresa,
                        FOLDER_SYNC_SUCCESS
                    );
                }

                const rsltLogsRegister = await fnGerarLogs({
                    cnpj_cliente: this.cnpj_empresa,
                    nome_arquivo: fileName,
                    error: false,
                    entidade: "viagens",
                    quantidade: String(arrayDados.length),
                    categoria: "SINCRONIZACAO_DADOS",
                    mensagem: "Sincronização dos dados das viagens concluídos com sucesso!",
                });

                console.log(`[VIAGENS X] || ${arrayDados?.length || 0} ${arrayDados?.length > 0 ? '|| ' + fileName : ''}`);
                if (arrayDados.length < SQL_LIMIT) break;
                offset += SQL_LIMIT;
            }

            resolve(true)
        })
    }
}

module.exports = Viagens