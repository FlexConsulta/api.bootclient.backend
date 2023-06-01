<<<<<<< HEAD
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company.js");
const { apiFlex } = require("../../API/api.js");
const Motoristas = require("./motoristas.js");
const Proprietarios = require("./proprietarios.js");
const Veiculos = require("./veiculos.js");
const Viagens = require("./viagens.js");
const moment = require("moment");
const { CNPJ } = process.env;

const ColetaDadosEstatisticos = async (req, res) => {

    const objAux = {
      cnpj_cliente: CNPJ,
      nome_arquivo: null,
      data: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
        const { dbObjectConnection, data_empresa } = await getInfoCompany();
        if (!data_empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");

        const logs = await apiFlex.get(`/bootclient/log/last/estatistico?cnpj=${CNPJ}`);
        const { motoristas, proprietarios, veiculos, viagens } = logs.data;

        Promise.all([
            await new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, log: motoristas, }),
            await new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, log: proprietarios }),
            await new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, log: veiculos }),
            await new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, log: viagens }),
        ])
            .then((data) => {

                if (res) res.status(202).send();
                console.log("Coleta de dados estatisticos concluída com sucesso!");
            })
            .catch(async (error) => {

                const objAux = {
                  cnpj_cliente: CNPJ,
                  nome_arquivo: null,
                  data: moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss"),
                };

                objAux.error = true
                objAux.mensagem = JSON.stringify(String(error))
                objAux.categoria = "dados_estatisticos_erro_promisses"
                await fnGerarLogs({ ...objAux, ...objAux });

            });
    } catch (error) {

      const objAux = {
        cnpj_cliente: CNPJ,
        nome_arquivo: null,
        data: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
      };

      objAux.error = true;
      objAux.mensagem = JSON.stringify(String(error));
      objAux.categoria = "dados_estatisticos_erro_geral";
      await fnGerarLogs({ ...objAux, ...objAux });
    }
};


module.exports = ColetaDadosEstatisticos;

=======
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company.js");
const { apiFlex } = require("../../API/api.js");
const Motoristas = require("./motoristas.js");
const Proprietarios = require("./proprietarios.js");
const Veiculos = require("./veiculos.js");
const Viagens = require("./viagens.js");
const moment = require("moment");
const { CNPJ } = process.env;
let WORKING_JOB = false

const ColetaDadosEstatisticos = async (req, res) => {

    const objAux = {
        cnpj_cliente: CNPJ,
        nome_arquivo: null,
        data: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
    };

    try {

        if (WORKING_JOB) return
        WORKING_JOB = true

        const { dbObjectConnection, data_empresa } = await getInfoCompany();
        if (!data_empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");

        const logs = await apiFlex.get(`/bootclient/log/last/estatistico?cnpj=${CNPJ}`);
        const { motoristas, proprietarios, veiculos, viagens } = logs.data;

        Promise.all([
            await new Motoristas({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_motoristas, log: motoristas, }),
            await new Proprietarios({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_proprietarios, log: proprietarios }),
            await new Veiculos({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_veiculos, log: veiculos }),
            await new Viagens({ dbObjectConnection, cnpj_empresa: data_empresa.cnpj_empresa, dbSQL: data_empresa.sql_viagens, log: viagens }),
        ])
            .then((data) => {

                if (res) res.status(202).send();
                console.log("Coleta de dados estatisticos concluída com sucesso!");
                WORKING_JOB = false

            }).catch(async (error) => {

                const categoria = "dados_estatisticos_erro_promisses"
                logErrors({ objAux, error, categoria })

            });


    } catch (error) {

        const categoria = "dados_estatisticos_erro_geral"
        logErrors({ objAux, error, categoria })

    }
};


async function logErrors({  objAux, error, categoria }) {
    WORKING_JOB = false

    console.log('[ERROR] Não foi possível coletar os dados estatísticos: \n');
    console.log('++++++++++ \n');
    console.log({ error });
    console.log('++++++++++ \n');

    objAux.error = true;
    objAux.mensagem = JSON.stringify(String(error));
    objAux.categoria = categoria;
    await fnGerarLogs({ ...objAux });
}


module.exports = ColetaDadosEstatisticos;

>>>>>>> joey.flex
