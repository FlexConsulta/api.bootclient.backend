const EventEmitter = require('events');

const ConexaoDbClienteAutomatico = require('../controller/coletar.informacoes/conexaoDbClienteAutomatico');
const ColetaDadosEstatisticosAutomatica = require('../controller/coleta.dados.estatisticos.automatica');
const MonitoramentoArquivosNaoEnviadosAutomatico = require("../controller/coletar.informacoes/arquivosPendentesAutomatico");
const FuncionamentoBootclientAutomatico = require("../controller/coletar.informacoes/funcbootclientAutomatico.js");
const VerificacaoEntidadesAutomatica = require("../controller/verificacao.automatica");
const UpdateApp = require("../controller/auto.update");

// Função que executa uma tarefa assíncrona
function executeTask(task) {
    return new Promise((resolve, reject) => {
        // Simulando um atraso de execução
        setTimeout(() => {
            // Simulando um erro aleatório
            const isError = Math.random() < 0.5;
            if (isError) {
                reject(new Error('Ocorreu um erro durante a execução da tarefa.'));
            } else {
                console.log(task);
                resolve(`Tarefa "${task}" concluída com sucesso.`);
            }
        }, Math.random() * 2000);
    });
}

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
                const result = await executeTask(task);
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
const tasks = [
    new ConexaoDbClienteAutomatico(),
    new ColetaDadosEstatisticosAutomatica(),
    new MonitoramentoArquivosNaoEnviadosAutomatico(),
    new FuncionamentoBootclientAutomatico(),
    new VerificacaoEntidadesAutomatica()
]

if (NODE_ENV == "PROD") {
    console.log('==== Rodando em produção ====');
    tasks.push(UpdateApp)
}


const executor = new ParallelExecutor(tasks);

executor.on('taskCompleted', (task, result) => {
    console.log(result);
});

executor.on('taskFailed', (task, error) => {
    console.error(`Erro na tarefa "${task}":`, error.message);
});

executor.on('allTasksCompleted', () => {
    console.log('Todas as tarefas foram concluídas.');
});

executor.execute();
