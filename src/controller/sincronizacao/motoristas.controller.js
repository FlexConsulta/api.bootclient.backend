const moment = require('moment');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao');
const { apiFlex } = require('../../API/api.js');
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS } = process.env;
// moment(value, ['DD/MM/YYY HH:mm', "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm"))

// ====================================================================================
let SQL = `SELECT mot.codmotorista, 
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

const SQL_COUNT = `SELECT COUNT(*) AS count
FROM motorista mot 
WHERE mot.codmotorista = (SELECT mot2.codmotorista FROM motorista mot2 WHERE mot.cpf = mot2.cpf ORDER BY COALESCE(mot2.dataatual, mot2.datainclusao) DESC LIMIT 1)`;
// ====================================================================================

class Motoristas extends GerarArquivo {

      constructor(empresa) {
            super()
            this.empresa = empresa;
            return new Promise(async resolve => {
                  await this.sincronizar();
                  resolve(true)
            })
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

                  const resultadoSequelize = await new sequelizePostgres(dataConexao)
                  let __resultCount = await resultadoSequelize.obterDados(SQL_COUNT);
                  __resultCount = __resultCount[0].count;
                  console.log({ Dados_sync: __resultCount });
                  let offset = 0;

                  if (__resultCount > SQL_LIMIT) {
                        const totalArquivos = Math.ceil(__resultCount / SQL_LIMIT);

                        for (let i = 0; i < totalArquivos; i++) {
                              const _sql = `${SQL} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;
                              const resultadoSequelize = await new sequelizePostgres(dataConexao)
                              const arrayDados = await resultadoSequelize.obterDados(_sql);
                              const dataEncriptado = await encryptedData(arrayDados)
                              await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_MOTORISTAS', this.empresa.cnpj_empresa, FOLDER_SYNC_SUCCESS)

                              const dadosLogs = {
                                    cnpj_cliente: this.empresa.cnpj_empresa,
                                    error: false,
                                    nome_arquivo: `SYNCz_MOTORISTAS_${this.empresa.cnpj_empresa}`,
                                    entidade: "motoristas",
                              };

                              // gera o log
                              //   await apiFlex.post(`/bootclient/log?cnpj=${this.empresa.cnpj_empresa}`, dadosLogs)
                              console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0}`);
                              offset += SQL_LIMIT;
                        }
                  } else {
                        const resultadoSequelize = await new sequelizePostgres(dataConexao)
                        const data = moment("2023-04-04 00:00:00", ["DD/MM/YYY HH:mm", "YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm")
                        const arrayDados = await resultadoSequelize.obterDados(MotoristaSetData(data));
                        const dataEncriptado = await encryptedData(arrayDados)
                        await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_MOTORISTAS', this.empresa.cnpj_empresa, FOLDER_SYNC_SUCCESS)

                        const dadosLogs = {
                              cnpj_cliente: this.empresa.cnpj_empresa,
                              error: false,
                              nome_arquivo: `SYNCz_MOTORISTAS_${this.empresa.cnpj_empresa}`,
                              entidade: "motoristas",
                        };

                        // gera o log
                        //   await apiFlex.post(`/bootclient/log?cnpj=${this.empresa.cnpj_empresa}`, dadosLogs)
                        console.log(`[MOTORISTAS X] || ${arrayDados?.length || 0}`);
                  }
                  resolve(true);
            })
      }
}

module.exports = Motoristas