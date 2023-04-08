const moment = require("moment")
const { fnGerarLogs } = require("../../utils/gerarLogs.js");
const getInfoCompany = require("../../utils/get.info.company.js");

class FuncionamentoBootclient {

    constructor() {
        console.log(`[i] Monitoramento funcionamento do bootclient: ${moment().format("LLLL")}`);
        this.start()
    }

    async start() {
        try {

            const { dbObjectConnection, data_empresa } = getInfoCompany()
            if (!data_empresa) res.status(404).send("Nenhuma empresa foi cadastrada!");

            const arrayResultSql = [] 

            for (const key in object) {
                if (Object.hasOwnProperty.call(object, key)) {
                    const element = object[key];
                    
                    arrayResultSql.push()
                }
            }


            fnGerarLogs({
                
            })

            console.log({ data_empresa, dbObjectConnection });

        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = FuncionamentoBootclient