const moment = require("moment")
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company.js");
const sequelizePostgres = require("../../services/sequelize.service");
const { CNPJ } = process.env;

class ConexaoDbCliente {

    constructor() {
        this.start()
    }

    async start() {
        try {

            const { dbObjectConnection, data_empresa } = await getInfoCompany();
            const resultadoSequelize = await new sequelizePostgres(dbObjectConnection);
            const query_result = await resultadoSequelize.testarConexao()

            query_result
              ? await fnGerarLogs({
                  cnpj_cliente: data_empresa.cnpj_empresa,
                  nome_arquivo: null,
                  error: false,
                  entidade: null,
                  quantidade: null,
                  categoria: "CONEXAO_DB_VALIDACAO",
                  data: moment()
                    .tz("America/Sao_Paulo")
                    .format("YYYY-MM-DD HH:mm:ss"),
                  mensagem: "conexão ao db cliente concluída com sucesso!",
                })
              : await fnGerarLogs({
                  cnpj_cliente: data_empresa.cnpj_empresa,
                  nome_arquivo: null,
                  error: true,
                  entidade: null,
                  quantidade: null,
                  categoria: "CONEXAO_DB_VALIDACAO",
                  data: moment()
                    .tz("America/Sao_Paulo")
                    .format("YYYY-MM-DD HH:mm:ss"),
                  mensagem: "conexão ao db cliente não está funcionando!",
                });
            

        } catch (error) {
            return await fnGerarLogs({
                cnpj_cliente: CNPJ,
                nome_arquivo: null,
                error: true,
                entidade: null,
                quantidade: null,
                categoria: "CONEXAO_DB_VALIDACAO_ERRO",
                data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
            });
        }
    }
}

module.exports = ConexaoDbCliente