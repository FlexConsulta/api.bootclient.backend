const { Company } = require('../config/databases');
const { funcaoDeDecriptarSimples } = require('../utils/tratamento.dados');

const pegarUmaEmpresa = async (filtro) => {
      await Company.asyncLoadDatabase()
      let resultado = await Company.asyncFindOne(filtro)
      if (resultado) resultado = await funcaoDeDecriptarSimples(resultado.d)
      return resultado
}


module.exports = {
      pegarUmaEmpresa: pegarUmaEmpresa
}