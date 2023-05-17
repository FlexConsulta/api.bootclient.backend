const express = require('express')
const { authenticate } = require('../utils/passport');

const ctrlSelecionarLogSincronizacoes = require('../controller/log.sincronizacoes/selecionar.log.sincronizacoes');
const ctrlDeletarLogSincronizacoes = require('../controller/log.sincronizacoes/deletar.log.sincronizacoes');

const app = express.Router()

app.route('/_api/log_sincronizacao')
    .get(authenticate(), ctrlSelecionarLogSincronizacoes)
    .delete(authenticate(), ctrlDeletarLogSincronizacoes.deletarTodosRegistros)

module.exports = app