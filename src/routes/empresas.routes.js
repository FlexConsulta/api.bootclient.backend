
const express = require('express')
const { authenticate } = require('../utils/passport');

const ctlCadastroEmpresa = require('../controller/empresa/cadastro.empresa');
const ctlSelecionarEmpresa = require('../controller/empresa/selecionar.empresa');
const ctlDeletarEmpresa = require('../controller/empresa/deletar.empresa');
const ctlAtualizarEmpresa = require('../controller/empresa/atualizar.empresa');

const app = express.Router()

app.route('/_api/empresa')
    .post(authenticate(), ctlCadastroEmpresa)
    .get(authenticate(), ctlSelecionarEmpresa)
    .delete(authenticate(), ctlDeletarEmpresa)
    .put(authenticate(), ctlAtualizarEmpresa)

module.exports = app