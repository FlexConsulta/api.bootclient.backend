const express = require('express')
const cors = require('cors');

const { NODE_ENV } = process.env

const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')


if( NODE_ENV == "PROD"){
    const SystemUpdateAuto = require("./controller/auto.update");
    new SystemUpdateAuto();
}

const ColetaDadosEstatisticosAutomatica = require('./controller/coleta.dados.estatisticos.automatica');
const MonitoramentoArquivos = require('./controller/monitoramento')
const SincronizacaoAutomatica = require('./controller/sincronizacao.automatica')
const VerificacaoEntidadesAutomatica = require("./controller/verificacao.automatica");
const SincronizacaoAutomaticaBackup = require('./controller/sincronizacao.automatica/sincronizacao.backup')
const LimpezaLogsSistema = require('./controller/log.sincronizacoes/limpeza.automatica.logs')
const MonitoramentoArquivosNaoEnviadosAutomatico = require("./controller/coletar.informacoes/arquivosPendentesAutomatico");
const FuncionamentoBootclientAutomatico = require("./controller/coletar.informacoes/funcbootclientAutomatico.js");
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

new ColetaDadosEstatisticosAutomatica();

new MonitoramentoArquivos(new Date());
new SincronizacaoAutomatica();
new MonitoramentoArquivosNaoEnviadosAutomatico();
new FuncionamentoBootclientAutomatico();
new VerificacaoEntidadesAutomatica();
new ConexaoDbClienteAutomatico();
new SincronizacaoAutomaticaBackup(new Date());
new LimpezaLogsSistema(new Date());

module.exports = app;