const express = require('express')
const cors = require('cors');

const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')

const AutoComplete = require('./controller/auto.update')
const MonitoramentoArquivos = require('./controller/monitoramento')
const SincronizacaoAutomatica = require('./controller/sincronizacao.automatica')
const VerificacaoAutomatica = require("./controller/verificacao.automatica");
const SincronizacaoAutomaticaBackup = require('./controller/sincronizacao.automatica/sincronizacao.backup')
const LimpezaLogsSistema = require('./controller/log.sincronizacoes/limpeza.automatica.logs')
const MonitoramentoArquivosNaoEnviadosAutomatico = require("./controller/coletar.informacoes/arquivosPendentesAutomatico");
const FuncionamentoBootclientAutomatico = require("./controller/coletar.informacoes/funcbootclientAutomatico.js");
const ColetaDadosEstatisticosAutomatica = require("./controller/coletar.informacoes/coleta.dados.estatisticos.automatica");
const ConexaoDbClienteAutomatico = require('./controller/coletar.informacoes/conexaoDbClienteAutomatico');

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


AutoComplete.start();
new MonitoramentoArquivos(new Date())
new SincronizacaoAutomatica()
new MonitoramentoArquivosNaoEnviadosAutomatico();
new FuncionamentoBootclientAutomatico();
new ColetaDadosEstatisticosAutomatica();
new VerificacaoAutomatica();
new ConexaoDbClienteAutomatico();
new SincronizacaoAutomaticaBackup(new Date())
new LimpezaLogsSistema(new Date())

module.exports = app;