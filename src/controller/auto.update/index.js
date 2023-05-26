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
                    
                    console.log('=========================================================');
                    console.log(`[i] Verificando atualizações do App: ${moment().tz('America/Sao_Paulo').format('LLL')}`);
                    console.log('=========================================================');
                    const gitRepository = simpleGit(process.env.GIT_PATH, options).clean(CleanOptions.FORCE);

                    const branchs = await gitRepository.branch()
                    const branchAtual = branchs.current;

                    if(branchAtual != BRANCH_PROD){
                        await gitRepository.checkoutBranch(BRANCH_PROD);
                        fn();
                        return;
                    } else console.log({ branchAtual });
                    console.log({ branchAtual });

                    // gitRepository.pull((err, atualizacao) => {
                    //     if (err) {
                    //         console.log(err);
                    //         return;
                    //     }

                    //     if (atualizacao && atualizacao.summary.changes) {

                    //         console.log(`[i] O sistema foi atualizado com sucesso: ${atualizacao.summary.changes}`);
                    //         exec(`pm2 restart ${PM2_PROCESS_RUNNING}`, (err, stdout, stderr) => {
                    //             if (err) {
                    //                 console.error(`Erro ao reiniciar aplicação: ${err}`);
                    //                 return;
                    //             }
                    //             console.log(`stdout: ${stdout}`);
                    //             console.error(`stderr: ${JSON.stringify(stderr)}`);
                    //         });


                    //     } else {
                    //         console.log("Nenhuma atualização disponível.");
                    //     }
                    // });
                };

                fn();
                schedule.scheduleJob(JOB_ATUALIZACAO_AUTOMATICA_CODIGO || "* 4 * * *", () => fn());
            } catch (error) {
                console.log({ error });
            }
        })();


    }
}

module.exports = SystemUpdateAuto;
