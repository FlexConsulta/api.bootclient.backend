const cron = require("node-cron");
const { simpleGit, CleanOptions } = require("simple-git")

const options = {
    baseDir: process.cwd(),
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
};

const repo = simpleGit(process.env.GIT_PATH, options).clean(CleanOptions.FORCE);
const intervaloAtualizacao = process.env.JOB_AUTO_UPDATE

const updateAppAuto = cron.schedule(intervaloAtualizacao, () => {
    
    console.log("[i] Verificando atualizações...");

    repo.pull((err, atualizacao) => {
        if (err) {
            console.log(err);
            return;
        }
        if (atualizacao && atualizacao.summary.changes) {
            console.log(`Atualizado!`);
        } else {
            console.log("Nenhuma atualização disponível.");
        }
    });
});

module.exports = updateAppAuto