const moment = require("moment");
const schedule = require("node-schedule");
const { simpleGit, CleanOptions } = require("simple-git")

moment.locale("pt-br");

const options = {
    baseDir: process.cwd(),
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
};

class SystemUpdateAuto {
    constructor() {
        (async () => {

            try {

                schedule.gracefulShutdown();

                const fn = () => {

                    console.log("[i] Verificando atualizações...");
                    const gitRepository = simpleGit(process.env.GIT_PATH, options).clean(CleanOptions.FORCE);

                    gitRepository.pull((err, atualizacao) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if (atualizacao && atualizacao.summary.changes) {
                            console.log(`[i] O sistema foi atualizado com sucesso: ${atualizacao.summary.changes}`);
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

module.exports = SystemUpdateAuto;
