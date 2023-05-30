const schedule = require("node-schedule");
const { simpleGit, CleanOptions } = require("simple-git")
const { exec } = require('child_process');

const moment = require("moment");
moment.locale("pt-br");
const { JOB_ATUALIZACAO_AUTOMATICA_CODIGO, PM2_PROCESS_RUNNING, BRANCH_PROD } =
  process.env;

class SystemUpdateAuto {
    constructor() {

        (async () => {
            try {

                const options = {
                    baseDir: process.cwd(),
                    binary: "git",
                    maxConcurrentProcesses: 6,
                    trimmed: false,
                };

                process.on("SIGINT", function () {
                    schedule.gracefulShutdown().then(() => process.exit(0));
                });
                
                const fn = async () => {
                    
                    console.log('=================================================================');
                    console.log(`[i] Verificando atualizações do App: ${moment().tz('America/Sao_Paulo').format('LLL')}`);
                    console.log('=================================================================');
                    const gitRepository = simpleGit(process.env.GIT_PATH, options).clean(CleanOptions.FORCE);

                    await gitRepository.fetch()

                    const branchs = await gitRepository.branch()
                    const branchAtual = branchs.current;

                    if (branchAtual !== BRANCH_PROD) {
                      console.log(`[i] Mudando para a branch ${BRANCH_PROD}`);
                      await gitRepository.checkout(BRANCH_PROD);
                      fn();
                      return;
                    } 

                    gitRepository.pull("origin", BRANCH_PROD, async (err, atualizacao) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if (atualizacao && atualizacao.summary.changes) {

                            exec('npm install', (error, stdout, stderr) => {
                                if (error) {
                                console.error('Erro ao executar npm install:', error);
                                return;
                                }
                                console.log(`stdout: ${stdout}`);
                                console.error(`stderr: ${JSON.stringify(stderr)}`);
                            });

                            console.log(`[i] O sistema foi atualizado com sucesso: ${atualizacao.summary.changes}`);
                            exec(`pm2 restart ${PM2_PROCESS_RUNNING}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(`Erro ao reiniciar aplicação: ${err}`);
                                    return;
                                }
                                console.log(`stdout: ${stdout}`);
                                console.error(`stderr: ${JSON.stringify(stderr)}`);
                            });

                        } else {
                            console.log("Nenhuma atualização disponível.");
                        }
                    });
                }

                fn();
                schedule.scheduleJob(JOB_ATUALIZACAO_AUTOMATICA_CODIGO || "* 4 * * *", () => fn());
            } catch (error) {
                console.log({ error });
            }
        })();


    }
}

module.exports = SystemUpdateAuto;
