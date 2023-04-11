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
            // throw new Error("Error manual");

            const { dbObjectConnection, data_empresa } = await getInfoCompany();
            let sqls = {
              getOne_motoristas: JSON.parse(data_empresa.sql_motoristas).getOne,
              getOne_proprietarios: JSON.parse(data_empresa.sql_proprietarios).getOne,
              getOne_veiculos: JSON.parse(data_empresa.sql_veiculos).getOne,
              getOne_viagens: JSON.parse(data_empresa.sql_viagens).getOne,
            };
            const arraySqls = [];
            
            for (const key in sqls) {
                let sql = sqls[key]
                const resultadoSequelize = await new sequelizePostgres(dbObjectConnection);
                const query_result = await resultadoSequelize.obterDados(sql)
                arraySqls.push({ [key]: query_result?.length });
            }

            const rsltLogsRegister = await fnGerarLogs({
              cnpj_cliente: data_empresa.cnpj_empresa,
              nome_arquivo: null,
              error: false,
              entidade: null,
              quantidade: JSON.stringify(arraySqls),
              categoria: "CONEXAO_DB_VALIDACAO",
              mensagem: "conexão ao db cliente concluída com sucesso!",
            });

            console.log({ rsltLogsRegister });

        } catch (error) {
          const rsltLogsRegister = await fnGerarLogs({
            cnpj_cliente: CNPJ,
            nome_arquivo: null,
            error: true,
            entidade: null,
            quantidade: null,
            categoria: "CONEXAO_DB_VALIDACAO_ERRO",
            mensagem: error && error.message ? JSON.stringify({ error: error.message }): null,
          });
          console.log({ rsltLogsRegister });
        }
    }
}

module.exports = ConexaoDbCliente