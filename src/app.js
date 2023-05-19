const express = require('express')
const cors = require('cors');
const { formatarData } = require("./utils/tratamento.dados");


const Task = require('./services/events')
const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')





// const MonitoramentoArquivos = require('./controller/monitoramento')
// const SincronizacaoAutomatica = require('./controller/sincronizacao.automatica')
// const SincronizacaoAutomaticaBackup = require('./controller/sincronizacao.automatica/sincronizacao.backup')
// const LimpezaLogsSistema = require('./controller/log.sincronizacoes/limpeza.automatica.logs')

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





// new MonitoramentoArquivos(formatarData(new Date()));
// new SincronizacaoAutomatica();
// new SincronizacaoAutomaticaBackup(formatarData(new Date()));
// new LimpezaLogsSistema(formatarData(new Date()));

module.exports = app;










