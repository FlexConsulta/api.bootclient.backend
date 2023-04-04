const { LogSincronizacao } = require('../config/databases');

const pegarUltimoLogSincronizacao = async (filtro = {}) => {
      const resultado = await LogSincronizacao.asyncFind(filtro, [['sort', { count: -1 }], ['limit', 1]])
      await LogSincronizacao.asyncLoadDatabase()
      return resultado && resultado[0] || null
}

const pegarTodosLogSincronizacao = async (filtro) => {
      const resultado = await LogSincronizacao.asyncFind(filtro)
      await LogSincronizacao.asyncLoadDatabase()
      return resultado
}

const criarLogSincronizacao = async (dados) => {
      await LogSincronizacao.asyncLoadDatabase()
      const resultado = await LogSincronizacao.asyncInsert(dados)
      await LogSincronizacao.asyncLoadDatabase()
      return resultado
}


const deletarTodosLogSincronizacao = async (filtro = {}) => {
      const resultado = await LogSincronizacao.asyncRemove(filtro, { multi: true })
      await LogSincronizacao.asyncLoadDatabase()
      return resultado
}


module.exports = {
      pegarUltimoLogSincronizacao: pegarUltimoLogSincronizacao,
      criarLogSincronizacao: criarLogSincronizacao,
      pegarTodosLogSincronizacao: pegarTodosLogSincronizacao,
      deletarTodosLogSincronizacao: deletarTodosLogSincronizacao
}