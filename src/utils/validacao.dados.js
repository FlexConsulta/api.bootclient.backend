const moment = require('moment');


function validacaoDosMotoristas(registBancoDeDados) {

    // Data atualizacao motorista
    if (!registBancoDeDados.dataatual) return false
    const dataAtualMot = moment(registBancoDeDados.dataatual).isValid()
    if (!dataAtualMot) return false

    // CPF
    if (!registBancoDeDados.cpf) return false
    const cpf = registBancoDeDados.cpf.replace(/\D/g, "");
    if (isNaN(cpf)) return false

    // Liberado
    if (!registBancoDeDados.liberado) return false
    const liberado = registBancoDeDados.liberado.toUpperCase()
    if (liberado !== "S" && liberado !== "N") return false

    // Nome
    if (!registBancoDeDados.nome) return false
    const nome = String(registBancoDeDados.nome).toUpperCase().trim()
    if (nome == "") return false

    // Liberado ADM
    if (registBancoDeDados.bloqueadoadm) {
        const bloqueadoadm = String(registBancoDeDados.bloqueadoadm).toUpperCase()
        if (bloqueadoadm !== "S" && bloqueadoadm !== "N" && bloqueadoadm !== "NULL" && bloqueadoadm !== "") return false
    }

    return true
}

function validacaoDosProprietarios(registBancoDeDados) {

    // Data atual
    if (!registBancoDeDados.dataatual) return false
    const dataAtualMot = moment(registBancoDeDados.dataatual).isValid()
    if (!dataAtualMot) return false

    // CGCPF
    if (!registBancoDeDados.cgccpf) return false
    const cgccpf = registBancoDeDados.cgccpf.replace(/\D/g, "");
    if (isNaN(cgccpf)) return false

    // Liberado
    if (!registBancoDeDados.liberado) return false
    const liberado = registBancoDeDados.liberado.toUpperCase()
    if (liberado !== "S" && liberado !== "N") return false

    // Nome
    if (!registBancoDeDados.nome) return false
    const nome = String(registBancoDeDados.nome).toUpperCase().trim()
    if (nome == "") return false

    // Liberado ADM
    if (registBancoDeDados.bloqueadoadm) {
        const bloqueadoadm = String(registBancoDeDados.bloqueadoadm).toUpperCase().trim()
        if (bloqueadoadm !== "S" && bloqueadoadm !== "N" && bloqueadoadm !== "NULL" && bloqueadoadm !== "") return false
    }

    return true

}

function validacaoDosVeiculos(registBancoDeDados) {

    // Data atual
    if (!registBancoDeDados.dataatual) return false
    const dataAtualMot = moment(registBancoDeDados.dataatual).isValid()
    if (!dataAtualMot) return false

    // Liberado
    if (!registBancoDeDados.liberado) return false
    const liberado = registBancoDeDados.liberado.toUpperCase()
    if (liberado !== "S" && liberado !== "N") return false

    // Placa
    if (!registBancoDeDados.placa) return false
    const placa = String(registBancoDeDados.placa).toUpperCase().trim()
    if (placa == "") return false

    // Liberado ADM
    if (registBancoDeDados.bloqueadoadm) {
        const bloqueadoadm = String(registBancoDeDados.bloqueadoadm).toUpperCase()
        if (bloqueadoadm !== "S" && bloqueadoadm !== "N" && bloqueadoadm !== "NULL" && bloqueadoadm !== "") return false
    }

    return true

}


function validacaoDasViagens(registBancoDeDados) {


    let {
        data, dataatual, dataatualmot, dataatualprop, dataatualveic,
        liberadomot, liberadoprop, liberadoveic,
        numero, nomecidadeorigem, ufcidadeorigem, nomecidadedestino, ufcidadedestino,
        bloqueadoadmmot, bloqueadoadmprop, bloqueadoadmveic,
        cpfmot, nomemot, cancelado,
        cgccpf, nomeprop, cavalo, mercadoria
    } = registBancoDeDados


    // DATA
    if (!data || !moment(data).isValid()) return false

    if (!dataatual || !moment(dataatual).isValid()) return false
    if (!dataatualmot || !moment(dataatualmot).isValid()) return false
    if (!dataatualprop || !moment(dataatualprop).isValid()) return false
    if (!dataatualveic || !moment(dataatualveic).isValid()) return false


    // LIBERADO
    if (!liberadomot) return false
    liberadomot = liberadomot.toUpperCase().trim()
    if (liberadomot !== "S" && liberadomot !== "N" && liberadomot !== "") return false

    if (!liberadoprop) return false
    liberadoprop = liberadoprop.toUpperCase().trim()
    if (liberadoprop !== "S" && liberadoprop !== "N" && liberadoprop !== "") return false

    if (!liberadoveic) return false
    liberadoveic = liberadoveic.toUpperCase().trim()
    if (liberadoveic !== "S" && liberadoveic !== "N" && liberadoveic !== "") return false


    // Numero
    if (!numero) return false
    numero = String(numero).replace(/\D/g, "");
    if (isNaN(numero)) return false


    // Cidade Origem
    if (!nomecidadeorigem || !ufcidadeorigem) return false

    nomecidadeorigem = String(nomecidadeorigem).toUpperCase().trim()
    if (nomecidadeorigem == "") return false

    ufcidadeorigem = String(ufcidadeorigem).toUpperCase().trim()
    if (ufcidadeorigem == "") return false

    // Cidade Destino
    if (!nomecidadedestino || !ufcidadedestino) return false

    nomecidadedestino = String(nomecidadedestino).toUpperCase().trim()
    if (nomecidadedestino == "") return false

    ufcidadedestino = String(ufcidadedestino).toUpperCase().trim()
    if (ufcidadedestino == "") return false


    // LIBERADO
    if (bloqueadoadmmot) {
        bloqueadoadmmot = bloqueadoadmmot.toUpperCase().trim()
        if (bloqueadoadmmot !== "S" && bloqueadoadmmot !== "N" && bloqueadoadmmot !== "") return false
    }

    if (bloqueadoadmprop) {
        bloqueadoadmprop = bloqueadoadmprop.toUpperCase().trim()
        if (bloqueadoadmprop !== "S" && bloqueadoadmprop !== "N" && bloqueadoadmprop !== "") return false
    }


    if (bloqueadoadmveic) {
        bloqueadoadmveic = bloqueadoadmveic.toUpperCase().trim()
        if (bloqueadoadmveic !== "S" && bloqueadoadmveic !== "N" && bloqueadoadmveic !== "") return false
    }


    if (!cpfmot || String(cpfmot).trim() == '') return false
    if (!nomemot || String(nomemot).trim() == '') return false

    if (!cgccpf || String(cgccpf).trim() == '') return false
    if (!nomeprop || String(nomeprop).trim() == '') return false

    if (!cavalo || String(cavalo).trim() == '') return false
    if (!mercadoria || String(mercadoria).trim() == '') return false


    if (cancelado) {
        cancelado = cancelado.toUpperCase().trim()
        if (cancelado !== "S" && cancelado !== "N" && cancelado !== "O" && cancelado !== "C" && cancelado !== "F" && cancelado !== "") {
            return false
        }
    }

    return true

}

function validacaoDosMdfes(registBancoDeDados) {

    let {
        dataatual, dataatualmot, dataatualprop, dataatualveic,
        liberadomot, liberadoprop, liberadoveic, bloqueadoadmveic,
        codmanif, statusmanif, cpfmot, nomemot, cgccpf,
        nomeprop, cavalo, mercadoria, bloqueadoadmmot, bloqueadoadmprop,
    } = registBancoDeDados

    if (!dataatual || !moment(dataatual).isValid()) return false
    if (!dataatualmot || !moment(dataatualmot).isValid()) return false
    if (!dataatualprop || !moment(dataatualprop).isValid()) return false
    if (!dataatualveic || !moment(dataatualveic).isValid()) return false

    // LIBERADO
    if (!liberadomot) return false
    liberadomot = liberadomot.toUpperCase().trim()
    if (liberadomot !== "S" && liberadomot !== "N" && liberadomot !== "") return false

    if (!liberadoprop) return false
    liberadoprop = liberadoprop.toUpperCase().trim()
    if (liberadoprop !== "S" && liberadoprop !== "N" && liberadoprop !== "") return false

    if (!liberadoveic) return false
    liberadoveic = liberadoveic.toUpperCase().trim()
    if (liberadoveic !== "S" && liberadoveic !== "N" && liberadoveic !== "") return false

    // Numero
    if (!codmanif) return false
    codmanif = String(codmanif).replace(/\D/g, "");
    if (isNaN(codmanif)) return false

    if (!statusmanif || String(statusmanif).trim() == '') return false
    if (!cpfmot || String(cpfmot).trim() == '') return false
    if (!nomemot || String(nomemot).trim() == '') return false

    if (!cgccpf || String(cgccpf).trim() == '') return false
    if (!nomeprop || String(nomeprop).trim() == '') return false

    if (!cavalo || String(cavalo).trim() == '') return false
    if (!mercadoria || String(mercadoria).trim() == '') return false


    // LIBERADO
    if (bloqueadoadmmot) {
        bloqueadoadmmot = bloqueadoadmmot.toUpperCase().trim()
        if (bloqueadoadmmot !== "S" && bloqueadoadmmot !== "N" && bloqueadoadmmot !== "") return false
    }

    if (bloqueadoadmprop) {
        bloqueadoadmprop = bloqueadoadmprop.toUpperCase().trim()
        if (bloqueadoadmprop !== "S" && bloqueadoadmprop !== "N" && bloqueadoadmprop !== "") return false
    }


    if (bloqueadoadmveic) {
        bloqueadoadmveic = bloqueadoadmveic.toUpperCase().trim()
        if (bloqueadoadmveic !== "S" && bloqueadoadmveic !== "N" && bloqueadoadmveic !== "") return false
    }


    return true

}

module.exports = {
    validacaoDosMotoristas: validacaoDosMotoristas,
    validacaoDosProprietarios: validacaoDosProprietarios,
    validacaoDosVeiculos: validacaoDosVeiculos,
    validacaoDasViagens: validacaoDasViagens,
    validacaoDosMdfes: validacaoDosMdfes
}