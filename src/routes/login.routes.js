const express = require('express')

const CtrlLogin = require('../controller/login/login.usuario')
const CtrlTrocarSenha = require('../controller/login/trocar.senha')
const app = express.Router()

app.route('/_api/login').post(CtrlLogin)
app.route('/_api/trocarsenha').post(CtrlTrocarSenha)

module.exports = app