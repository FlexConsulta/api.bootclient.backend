const { Sequelize, QueryTypes } = require('sequelize');

class SequelizeFunctions {


      constructor(dados) {

            this.conexao(dados)
            this.objSequelize = null
      }

      async conexao({ nome_banco, usuario_banco, senha_banco, host_banco, dialect, porta_banco }) {


            this.objSequelize = await new Sequelize(nome_banco, usuario_banco, senha_banco, {
                  host: host_banco, dialect: dialect, port: porta_banco,
                  // logging: console.log,
            });
      }

      testarConexao() {
            return new Promise(async (resolve) => {
                  try {

                        if (!this.objSequelize) console.log("Os dados da conexão estão inválidos!")
                        await this.objSequelize.authenticate()
                        resolve(true)

                  } catch (error) {
                        console.log(`Conexão inválida com o banco de dados!`)
                        resolve(false)
                  }
            })

      }


      obterDados(sql) {
            return new Promise(async (resolve) => {

                  try {

                        const resultadoTeste = await this.testarConexao()
                        if (!resultadoTeste) throw new Error('Conexão inválida com o banco de dados!')

                        const arrDataQuery = await this.objSequelize.query(sql,
                              { type: QueryTypes.SELECT }
                        )

                        this.objSequelize.close()
                        resolve(arrDataQuery)

                  } catch (error) {
                        console.log(error);
                  }
            })


      }
}

module.exports = SequelizeFunctions