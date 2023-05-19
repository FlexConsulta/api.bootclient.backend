const express = require('express')
const cors = require('cors');

const Events = require('./services/events')
const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')

const app = express()

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next()

})


app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(RouteLogin)
app.use(RouteEmpresa)
app.use(RouteSincronizacao)
app.use(RouteLogs)

console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log("[MENSAGEM] A aplicação startou: ", new Date());
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n');
Events.execute();
module.exports = app;