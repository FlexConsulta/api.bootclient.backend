const moment = require('moment');
const { VeiculosGetAll, VeiculosSetData } = require('../../config/sql/veiculos');
const GerarArquivo = require('../../utils/gerador.arquivo.js');
const sequelizePostgres = require('../../services/sequelize.service');
const { encryptedData } = require('../../utils/encriptacao')
const { apiFlex } = require("../../API/api.js");
const { SQL_LIMIT, FOLDER_SYNC_SUCCESS } = process.env;

class Veiculos extends GerarArquivo {

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
                  let __resultCount = await resultadoSequelize.obterDados(this.empresa.sql_count_veiculos);
                  __resultCount = __resultCount[0].count;
                  console.log({ Dados_sync: __resultCount });
                  let offset = 0;

                  if (__resultCount > SQL_LIMIT) {
                        const totalArquivos = Math.ceil(__resultCount/SQL_LIMIT);

                        for (let i = 0; i < totalArquivos; i++) {
                        const _sql = `${this.empresa.sql_veiculos} LIMIT ${SQL_LIMIT} OFFSET ${offset}`;
                        const resultadoSequelize = await new sequelizePostgres(dataConexao)
                        const arrayDados = await resultadoSequelize.obterDados(_sql);
                        const dataEncriptado = await encryptedData(arrayDados)
                        await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_VEICULOS', this.empresa.cnpj_empresa, FOLDER_SYNC_SUCCESS)

                        const dadosLogs = {
                          cnpj_cliente: this.empresa.cnpj_empresa,
                          error: false,
                          nome_arquivo: `SYNCz_VEICULOS_${this.empresa.cnpj_empresa}`,
                          entidade: "veiculos",
                        };

                        // gera o log
                        //   await apiFlex.post(`/bootclient/log?cnpj=${this.empresa.cnpj_empresa}`, dadosLogs)
                        console.log(`[VEICULOS X] || ${arrayDados?.length || 0}`);
                        offset += SQL_LIMIT;
                        }

                  }else{
                    const resultadoSequelize = await new sequelizePostgres(dataConexao)
                    const data = moment(this.empresa.dt_ultima_sync_veiculos, ["DD/MM/YYY HH:mm","YYYY/MM/DD HH:mm"]).format("YYYY/MM/DD HH:mm")
                    // ALTERAR SQL - COLOCAR DATA
                    const arrayDados = await resultadoSequelize.obterDados(this.empresa.sql_veiculos);
                    const dataEncriptado = await encryptedData(arrayDados)
                    await this.fnGeradorArquivos(dataEncriptado, 'SYNCz_VEICULOS', this.empresa.cnpj_empresa, FOLDER_SYNC_SUCCESS)

                    const dadosLogs = {
                      cnpj_cliente: this.empresa.cnpj_empresa,
                      error: false,
                      nome_arquivo: `SYNCz_VEICULOS_${this.empresa.cnpj_empresa}`,
                      entidade: "veiculos",
                    };

                    // gera o log
                    //   await apiFlex.post(`/bootclient/log?cnpj=${this.empresa.cnpj_empresa}`, dadosLogs)
                    console.log(`[VEICULOS X] || ${arrayDados?.length || 0}`);
            }
              resolve(true);
            })
      }
}

module.exports = Veiculos