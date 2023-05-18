const schedule = require("node-schedule");
const { simpleGit, CleanOptions } = require("simple-git")
const { exec } = require('child_process');

const moment = require("moment");
moment.locale("pt-br");
const { JOB_SINCRONIZACAO_AUTO } = process.env

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

                schedule.gracefulShutdown();

                const fn = () => {

                    console.log(`[i] Verificando atualizações: ${moment().tz('America/Sao_Paulo').format('LLL')}`);
                    const gitRepository = simpleGit(process.env.GIT_PATH, options).clean(CleanOptions.FORCE);

                    gitRepository.pull((err, atualizacao) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if (atualizacao && atualizacao.summary.changes) {
                            
                            console.log(`[i] O sistema foi atualizado com sucesso: ${atualizacao.summary.changes}`);
                            exec('pm2 restart 90', (err, stdout, stderr) => {
                                if (err) {
                                    console.error(`Erro ao reiniciar aplicação: ${err}`);
                                    return;
                                }
                                console.log(`stdout: ${stdout}`);
                                console.error(`stderr: ${stderr}`);
                            });


                        } else {
                            console.log("Nenhuma atualização disponível.");
                        }
                    });
                };

                fn();
                schedule.scheduleJob(JOB_SINCRONIZACAO_AUTO || "*/2 * * * *", fn);

            } catch (error) {
                console.log({ error });
            }

        })();
    }
}

module.exports = ()=> new SystemUpdateAuto();
