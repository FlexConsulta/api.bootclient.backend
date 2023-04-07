const express = require('express')
const cors = require('cors');

const RouteLogin = require('./routes/login.routes')
const RouteEmpresa = require('./routes/empresas.routes')
const RouteSincronizacao = require('./routes/sincronizacao.routes')
const RouteLogs = require('./routes/logs.routes')

const MonitoramentoArquivos = require('./controller/monitoramento')
const SincronizacaoAutomatica = require('./controller/sincronizacao.automatica')
const SincronizacaoAutomaticaBackup = require('./controller/sincronizacao.automatica/sincronizacao.backup')
const LimpezaLogsSistema = require('./controller/log.sincronizacoes/limpeza.automatica.logs')
const MonitoramentoArquivosNaoEnviados = require("./controller/coletar.informacoes/arquivos.pendentes")

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

/**
 * FIXME: Sincronização Automática dos dados
 * TODO: Verificar o funcionamento do Bootclient
 * TODO: Verificar a conexão com o banco de dados do cliente
 * TODO: Coletar dados estatísticos dos dados do clientes
 *      TODO: Total registros das tabelas (Diariamente -1)
 *      TODO: Total Status das entidades (Motoristas, Proprietários, Veículos) (Diariamente -1)
 *      TODO: Total viagens cancelados  (Diariamente -1)
 */


// new MonitoramentoArquivos(new Date())
new SincronizacaoAutomatica(new Date())
// new MonitoramentoArquivosNaoEnviados()

// new SincronizacaoAutomaticaBackup(new Date())
// new LimpezaLogsSistema(new Date())


module.exports = app;