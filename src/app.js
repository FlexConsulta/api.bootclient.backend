const express = require('express')
const cors = require('cors');

const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')

const AutoUpdate = require('./controller/auto.update')
const MonitoramentoArquivos = require('./controller/monitoramento')
const SincronizacaoAutomatica = require('./controller/sincronizacao.automatica')
const VerificacaoAutomatica = require("./controller/verificacao.automatica");
const SincronizacaoAutomaticaBackup = require('./controller/sincronizacao.automatica/sincronizacao.backup')
const LimpezaLogsSistema = require('./controller/log.sincronizacoes/limpeza.automatica.logs')
const MonitoramentoArquivosNaoEnviados = require("./controller/coletar.informacoes/arquivos.pendentes")
const FuncionamentoBootclient = require("./controller/coletar.informacoes/funcionamento.bootclient");
const ColetaDadosEstatisticosAutomatica = require("./controller/coletar.informacoes/coleta.dados.estatisticos.automatica");

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


AutoUpdate.start();
// new MonitoramentoArquivos(new Date())
// new MonitoramentoArquivosNaoEnviados()
// new SincronizacaoAutomatica(new Date())
new FuncionamentoBootclient(new Date())
// new ColetaDadosEstatisticosAutomatica();
// new VerificacaoAutomatica();

// new SincronizacaoAutomaticaBackup(new Date())
// new LimpezaLogsSistema(new Date())

module.exports = app;