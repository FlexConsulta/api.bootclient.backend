const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company");
const { apiFlex } = require("../../API/api");
const Motoristas = require("./motoristas.js");
const Proprietarios = require("./proprietarios.js");
const Veiculos = require("./veiculos.js");
const Viagens = require("./viagens.js");
const { CNPJ } = process.env;

 const ColetaDadosEstatisticos = async (req, res) => {
   try {
     const { dbObjectConnection, data_empresa } = await getInfoCompany();
     if (!data_empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");

     const logs = await apiFlex.get(`/bootclient/log/last/estatistico?cnpj=${CNPJ}`);
     const { motoristas, proprietarios, veiculos, viagens } = logs.data;

     Promise.all([
       await new Motoristas({dbObjectConnection,cnpj_empresa: data_empresa.cnpj_empresa,dbSQL: data_empresa.sql_motoristas,log: motoristas,}),
       await new Proprietarios({dbObjectConnection,cnpj_empresa: data_empresa.cnpj_empresa,dbSQL: data_empresa.sql_proprietarios, log: proprietarios}),
       await new Veiculos({dbObjectConnection,cnpj_empresa: data_empresa.cnpj_empresa,dbSQL: data_empresa.sql_veiculos, log: veiculos}),
       await new Viagens({dbObjectConnection,cnpj_empresa: data_empresa.cnpj_empresa,dbSQL: data_empresa.sql_viagens, log: viagens}),
     ])
       .then(() => {
         // throw new Error("Error manual");

         if (res) res.status(202).send();
         console.log("Sincronização concluída com sucesso!");
       })
       .catch(async (error) => {
         const rsltLogsRegister = await fnGerarLogs({
           cnpj_cliente: CNPJ,
           nome_arquivo: null,
           error: true,
           entidade: null,
           quantidade: null,
           categoria: "dados_estatisticos_erro_promisses",
           mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
         });
         console.log({ rsltLogsRegister });
       });
   } catch (error) {
     const rsltLogsRegister = await fnGerarLogs({
       cnpj_cliente: CNPJ,
       nome_arquivo: null,
       error: true,
       entidade: null,
       quantidade: null,
       categoria: "dados_estatisticos_erro_geral",
       mensagem: error && error.message ? JSON.stringify({ error: error.message }) : null,
     });
     console.log({ rsltLogsRegister });
   }
 };   


module.exports = ColetaDadosEstatisticos;

