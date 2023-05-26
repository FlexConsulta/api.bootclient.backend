const { LogSincRemoto } = require('../config/databases');

const pegarTodosLogEnvioArquivos = async (filtro) => {
      const resultado = await LogSincRemoto.asyncFind(filtro)
      return resultado
}

const criarLogEnvioArquivos = async (dados) => {

      await LogSincRemoto.asyncLoadDatabase()
      const resultado = await LogSincRemoto.asyncInsert(dados)
      return resultado
}


const deletarTodosLogEnvioArquivos = async (filtro = {}) => {
      const resultado = await LogSincRemoto.asyncRemove(filtro, { multi: true })
      await LogSincRemoto.asyncLoadDatabase()
      return resultado
}


module.exports = {
      pegarTodosLogEnvioArquivos: pegarTodosLogEnvioArquivos,
      criarLogEnvioArquivos: criarLogEnvioArquivos,
      deletarTodosLogEnvioArquivos: deletarTodosLogEnvioArquivos
}