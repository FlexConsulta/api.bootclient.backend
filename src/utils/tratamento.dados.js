const jwt = require('jwt-simple');
const fs = require('fs');
const moment = require("moment");
const { ENCODED } = process.env

/**
 * 
 * @param {*} array 
 * @description Esse módulo tem como objetivo Encriptar e Decriptar os dados 
 * do banco de dados 
 */
const funcaoDeEncriptar = async (array) => {

    let data = []
    for (const idx in array) {

        const dt = await jwt.encode({ array }, ENCODED)
        data.push({ ...dt, _id: array[idx]._id })

    }
    return data
}

const funcaoDeEncriptarSimples = async (objectData) => {
    return await jwt.encode(objectData, ENCODED)
}

const funcaoDeEncriptarDados = async (objectData) => {
    const KEY =  process.env.KEY
    if(!KEY) throw new Error("Chave de encriptação dos dados inexistente!")
    return await jwt.encode(objectData, process.env.KEY)
}


const funcaoDeDecriptarSimples = async (objectData) => {
    return await jwt.decode(objectData, ENCODED)
}


const funcaoDeDecriptar = async (array) => {

    let data = []
    for (const idx in array) {

        const dt = await jwt.decode(array[idx].data, ENCODED)
        data.push({ ...dt, _id: array[idx]._id })

    }
    return data
}

const funcaoDeDecriptarSemId = async (array) => {

    let data = []
    for (const idx in array) {

        const dt = await jwt.decode(array[idx].data, ENCODED)
        data.push(...dt)

    }
    return data
}



function funcReadFiles(urlFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(urlFile, 'utf8', (err, data) => {
            if (err) return console.log('Ocorreu um erro na importação dos arquivos!')
            resolve(data)
        })
    })
}

const formatarData = (date) => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}; 


module.exports = {
  funcaoDeEncriptar,
  funcaoDeDecriptar,
  funcaoDeEncriptarSimples,
  funcReadFiles,
  funcaoDeDecriptarSimples,
  funcaoDeDecriptarSemId,
  funcaoDeEncriptarDados,
  formatarData,
};