const { fnGerarLogs } = require('../../utils/gerarLogs');
const getInfoCompany = require('../../utils/get.info.company');
const Motoristas = require('./motoristas.controller');
const Proprietarios = require('./proprietarios.controller');
const Veiculos = require('./veiculos.controller');
const Viagens = require('./viagens.controller');
const { CNPJ } = process.env


module.exports = async (req, res) => {
    const { dbObjectConnection, data_empresa } = await getInfoCompany();
    if (!data_empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");

    Promise.all([
        new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas}),
        new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios}),
        new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos}),
        new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens}),
    ]).then(async () => {
        throw new Error("Error manual");

        if (res) res.status(202).send();
        console.log("Verificação concluída com sucesso!");
    }).catch(async (error) => {
        const rsltLogsRegister = await fnGerarLogs({
          cnpj_cliente: CNPJ,
          nome_arquivo: null,
          error: true,
          entidade: null,
          quantidade: null,
          categoria: "VERIFICACAO_ENTIDADE_ERRO_GERAL",
          mensagem: (error && error.message) ? JSON.stringify({ error: error.message }) : null,
        });
        console.log({ rsltLogsRegister });
    });
}
