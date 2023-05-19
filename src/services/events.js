const EventEmitter = require('events');

const ConexaoDbClienteAutomatico = require('../controller/coletar.informacoes/conexaoDbClienteAutomatico');
const ColetaDadosEstatisticosAutomatica = require('../controller/coleta.dados.estatisticos.automatica');
const MonitoramentoArquivosNaoEnviadosAutomatico = require("../controller/coletar.informacoes/arquivosPendentesAutomatico");
const FuncionamentoBootclientAutomatico = require("../controller/coletar.informacoes/funcbootclientAutomatico.js");
const VerificacaoEntidadesAutomatica = require("../controller/verificacao.automatica");
const SystemUpdateAuto = require("../controller/auto.update");
const MonitoramentoArquivos = require('../controller/monitoramento')
const SincronizacaoAutomatica = require('../controller/sincronizacao.automatica')
const SincronizacaoAutomaticaBackup = require('../controller/sincronizacao.automatica/sincronizacao.backup')
const LimpezaLogsSistema = require('../controller/log.sincronizacoes/limpeza.automatica.logs')


const { NODE_ENV } = process.env


// Classe que representa um executor paralelo
class ParallelExecutor extends EventEmitter {
    constructor(tasks) {
        super();
        this.tasks = tasks;
        this.completedTasks = 0;
    }

    async execute() {
        for (const task of this.tasks) {
            try {
                const result = await task
                this.emit('taskCompleted', task, result);
            } catch (error) {
                this.emit('taskFailed', task, error);
            } finally {
                this.completedTasks++;
                if (this.completedTasks === this.tasks.length) {
                    this.emit('allTasksCompleted');
                }
            }
        }
    }
}

// Uso do executor paralelo
let tasks = [
    new ConexaoDbClienteAutomatico(),
    new ColetaDadosEstatisticosAutomatica(),
    new MonitoramentoArquivosNaoEnviadosAutomatico(),
    new FuncionamentoBootclientAutomatico(),
    new VerificacaoEntidadesAutomatica(),
    // new MonitoramentoArquivos(new Date()),
    new SincronizacaoAutomatica(),
    new SincronizacaoAutomaticaBackup(new Date()),
    new LimpezaLogsSistema(new Date())
]

if (NODE_ENV == "PROD") {
    console.log('==== Rodando em produção ====');
    tasks = [...tasks, new SystemUpdateAuto()]
}

const executor = new ParallelExecutor(tasks);

executor.on('taskCompleted', (task, result) => {
    console.log('[START]: ', result);
});

executor.on('taskFailed', (task, error) => {
    console.log('=========================================================');
    console.log({ error });
    console.log('=========================================================');
});

executor.on('allTasksCompleted', () => {
    console.log('Todas as tarefas foram concluídas.');
});


module.exports = executor
