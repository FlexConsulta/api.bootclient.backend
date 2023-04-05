const moment = require('moment');
const { MotoristaGetAll, MotoristaSetData } = require('../../config/sql/motoristas.js');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { apiFlex } = require('../../API/api.js');
this.pastaSync = process.env.FOLDER_SYNC_SUCCESS

// ====================================================================================
const SQL = `SELECT mot.codmotorista, 
coalesce(mot.dataatual, mot.datainclusao) AS dataatual,
mot.cpf,
mot.liberado,
mot.nome,
mot.celular,
mot.fone,
mot.bloqueadoadm
FROM motorista mot 
WHERE mot.codmotorista = (select mot2.codmotorista from motorista mot2 where mot.cpf = mot2.cpf order by coalesce(mot2.dataatual, mot2.datainclusao) desc limit 1 )
ORDER BY coalesce(mot.dataatual, mot.datainclusao) ASC`

const SQL_COUNT = `SELECT COUNT(*) FROM motorista`

// ====================================================================================


class Motoristas extends GerarArquivo {

      constructor(empresa) {
            super()

            this.empresa = empresa;

            return new Promise(async resolve => {
                  await this.fnStart()
                  resolve(true)
            })
      }

      async fnStart(value) {
            const data = { data: value }
            await this.sincronizar(data);
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

                  let limit = 0
                  let offset = 0;


                  const resultadoSequelize = await new sequelizePostgres(dataConexao)
                  const __resultCount = await resultadoSequelize.obterDados(SQL_COUNT);

                  if (__resultCount > 1000) {
                        SQL = `${SQL} OFFSET ${offset} lLIMIT ${limit}`
                  } else {

                  }

                  // while (true) {

                  //       // setar a query
                  //       let query;
                  //       if (!data.data) {
                  //             const replaceParameters = (string, offset) => {
                  //                   const arr = string.split("{");
                  //                   arr.splice(1, 1, `${SQL_LIMIT} OFFSET `);
                  //                   arr.splice(2, 1, `${offset}`);
                  //                   string = String(arr.join(""));
                  //                   return string;
                  //             };
                  //             query = replaceParameters(data.query_sql, offset);
                  //       } else query = data.query_sql;

                  //       // faz a query

                  //       // criar arquivo
                  //       if (arrayDados?.length > 0) {
                  //             const dataEncriptado = await encryptedData(arrayDados)
                  //             await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_MOTORISTAS', CNPJ, this.pastaSync)

                  //             const dadosLogs = {
                  //                   cnpj_cliente: CNPJ,
                  //                   error: false,
                  //                   nome_arquivo: `SYNCz_MOTORISTAS_${CNPJ}`,
                  //                   entidade: "MOTORISTAS",
                  //             };

                  //             // gera o log
                  //             await apiFlex.post(`/bootclient/log?cnpj=${CNPJ}`, dadosLogs)
                  //       }

                  //       console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0}`);
                  //       arquivos++;
                  //       if (arrayDados.length < SQL_LIMIT) break
                  //       offset += SQL_LIMIT;
                  // }
                  // console.log({ arquivos })
                  resolve(true);

            })

      }

}

module.exports = Motoristas