const app = require('express').Router()
const { authenticate } = require('../utils/passport');

const sincronizacao = require('../controller/sincronizacao');

app.route('/_api/sincronizar')
    .post(authenticate(), sincronizacao)

module.exports = app