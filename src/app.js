const express = require('express')
const cors = require('cors');
const fs = require("fs");
const YAML = require("yaml");
const moment = require("moment");

const Events = require('./services/events')
const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.parse(fs.readFileSync("./swagger.yaml", "utf8"));

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log("[MENSAGEM] A aplicação startou: ", moment().tz('America/Sao_Paulo').format("LLL"));
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n');

Events.execute();
module.exports = app;